import React, { useState, ChangeEvent } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
// import cn from 'classnames';
import styles from './CustomTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { setTitleValueAction, setVacanciesAction, useTitleValue, useVacancies } from '../../slices/MainSlice';
import { useDispatch } from 'react-redux';
import ModalWindow from '../ModalWindow/ModalWindow';
import { Link } from 'react-router-dom';
import { title } from 'process';

export type ReceivedVacancyData = {
    id: number,
    title: string,
    salary: number,
    city: string,
    company: string,
    exp: string | undefined | null,
    image: string | undefined | null;
    status:string;
    info?: string,
    adress?: string |null
}

type ColumnData = {
    key: string;
    title: string;
  }

export type TableData = {
    columns: ColumnData[];
    data: any[];
    children?: React.ReactNode;
    flag: 0 | 1 | 2 | 3;
    className?: string;
  };

export type VacancyData = {
  id: number,
  title: string,
  salary: number,
  city?: string | undefined| null,
  company: string,
  exp: string,
  image?: string | undefined | null,
  status: string,
  info?: string,
  adress?: string |null
}

const CustomTable: React.FC<TableData> = ({columns, data, className}) => {
    const vacancies = useVacancies()
    const dispatch = useDispatch()
    const sth = 0;
    const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false)
    const [currentVacanciesId, setCurrentVacanciesId] = useState<number>()
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState('')
    const [createRow, setCreateRow] = useState(false);
    const [editableRows, setEditableRows] = useState<number | null>(null);
    const [dictionary, setDictionary] = useState<VacancyData>({
      id: 0,
      title: "",
      salary: 0,
      city: "",
      company: "",
      exp: "",
      image: null,
      status: "",
      info: undefined,
      adress: null,

    });
    const [expandedRows, setExpandedRows] = useState<number[]>([]);


    
    console.log(dictionary)
    const toggleExpansion = (rowId: number) => {
      if (expandedRows.includes(rowId)) {
        setExpandedRows(expandedRows.filter((id) => id !== rowId));
      } else {
        setExpandedRows([...expandedRows, rowId]);
      }
    };
   
    
    const deleteVacancy = async () => {
      try {
        await axios(`http://localhost:8001/vacancies/${currentVacanciesId}/delete`, {
          method: 'DELETE',
          withCredentials: true,
  
        })
  
        dispatch(setVacanciesAction(vacancies.filter((vacancy) => {
          return vacancy.id !== currentVacanciesId 
        })))
        toast.success('Вакансия удалена')
      } catch(e) {
        throw e
      }
    }
  
    const handleUpload = async () => {
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append('file', selectedImage);
  
          const response = await axios.post(
            `http://localhost:8001/vacancies/${currentVacanciesId}/image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            }
          );
          const updatedVacancies = vacancies.map(vacancy => {
            if (vacancy.id === currentVacanciesId) {
              return {
                ...vacancy,
                image: response.data.image
              };
            }
            return vacancy;
          });
          dispatch(setVacanciesAction(updatedVacancies))
          console.log(updatedVacancies)
          setSelectedImage(null)
          toast.success('Изображение успешно загружено')
  
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          setIsImageModalWindowOpened(false)
        }
      }
    };
  
    // const handleSubscriptionFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault()
    //   if (isAddModalWindowOpened) {
    //     postSubscription()
    //   } else if(currentSubscriptionId) {
    //     putSubscription(currentSubscriptionId)
    //   }
    // }
  

  
    const handleDeleteButtonClick = (id: number) => {
      setCurrentVacanciesId(id)
      deleteVacancy();
    }
  
    const handleImageButtonClick = (vacancy: VacancyData) => {
      setCurrentVacanciesId(vacancy.id || 0)
      setIsImageModalWindowOpened(true)
      setCurrentImage(vacancy.image || '');
    }

    const handleEditButtonClick = (selectedVacancy: VacancyData, row: number) => {
      console.log(row)
      setEditableRows(row);
      console.log("выбранная вакансия", selectedVacancy)
      const updatedDictionary = {
        title: selectedVacancy.title,
        salary: selectedVacancy.salary,
        adress: selectedVacancy.adress,
        exp: selectedVacancy.exp,
        city: selectedVacancy.city,
        info: selectedVacancy.info,
        company: selectedVacancy.company,
        id: selectedVacancy.id,
        image: selectedVacancy.image,
        status: selectedVacancy.status
      };
  
      setDictionary(updatedDictionary);
    };
  
 
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      }
    };

    const handleCreateButtonClick = () => {
      const newVacancy: VacancyData = {
        id: 0,
        title: "",
        salary: 0,
        city: null,
        company: "",
        exp: "",
        image: null,
        status: "",
        adress: null,
        info: "",
      };
      setDictionary(newVacancy)
      setCreateRow(true)
      
    };

    const postVacancy = async () => {
      console.log("нажали")
      if (dictionary.title.length == 0) {
        return toast.error("Введите название вакансии")
      }
      if (dictionary.salary == 0) {
        return toast.error("Введите зарплату")
      }
      if (dictionary.company.length == 0) {
        return toast.error("Введите название компании")
      }
      if (dictionary.exp.length == 0) {
        return toast.error("Введите требуемый опыт работы")
      }
      if (!dictionary.city) {
        return toast.error("Введите город работы")
      }
      let i;
      if (dictionary.info == "") {
        i = null;
      }
      else {
        i = dictionary.info
      }
      try {
        const response = await axios(`http://localhost:8001/vacancies/post`, {
          method: 'POST',
          data: {
            title: dictionary.title,
            salary: dictionary.salary,
            info: i,
            city: dictionary.city,
            adress: dictionary.adress,
            exp: dictionary.exp,
            company: dictionary.company
          },
          withCredentials: true
        })

        console.log(response)

        const jsonData = response.data;
        const newArr = jsonData.map((raw: ReceivedVacancyData) => ({
            id: raw.id,
            title: raw.title,
            salary: raw.salary,
            city: raw.city,
            company: raw.company,
            image: raw.image,
            exp: raw.exp,
            status: raw.status,
            info: raw.info,
            adress: raw.adress
        }));
        dispatch(setVacanciesAction(newArr));
 
        setCreateRow(false)
        setDictionary({       id: 0,
          title: "",
          salary: 0,
          city: "",
          company: "",
          exp: "",
          image: null,
          status: "",
          info: undefined,
          adress: null,});
        toast.success('Вакансия добавлена')
      } catch(e) {
        toast.error('Ошибка')
        throw e
      }
  }

  const putVacancy = async () => {
    try {
      const response = await axios(`http://localhost:8001/vacancies/${dictionary?.id}/put/`, {
        method: 'PUT',
        data: {
          title: dictionary.title,
          salary: dictionary.salary,
          info: dictionary.info,
          city: dictionary.city,
          adress: dictionary.adress,
          exp: dictionary.exp,
          company: dictionary.company
        },
        withCredentials: true
      })

      const updatedVacancies = vacancies.map(vacancy => {
        if (vacancy.id === dictionary?.id) {
          return {
            ...vacancy,
            title: dictionary.title,
          salary: dictionary.salary,
          info: dictionary.info,
          city: dictionary.city,
          adress: dictionary.adress,
          exp: dictionary.exp,
          company: dictionary.company
          };
        }
        return vacancy;
      });
      dispatch(setVacanciesAction(updatedVacancies))
      setEditableRows(null);
      setDictionary({       id: 0,
        title: "",
        salary: 0,
        city: "",
        company: "",
        exp: "",
        image: null,
        status: "",
        info: undefined,
        adress: null,});
      toast.success('Информация успешно обновлена!')
    } catch(e) {
      toast.error('Такая вакансия уже существует!')
      throw e
    }
}



    return (
      <>
        <div className={`${styles.table__container} ${className}`}>
        <div className={`${styles.table__add} ${className}`}>
          <h6>
        <Link  onClick={() => handleCreateButtonClick()} to={`/edit/${sth}`}>Новая вакансия</Link>
        </h6>
        </div>
        <Table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
                {<th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>
                  {row.id == editableRows ? (
                    <input
                    type="text"
                    value={dictionary[column.key as keyof typeof dictionary] as string}
                    onChange={(event) => {
                      const updatedDictionary = {
                        ...dictionary,
                        [column.key]: event.target.value
                      };
                      setDictionary(updatedDictionary);
                    }}
                  />
                  ) : column.key === "info" && row[column.key] !== null ? (
                    <div>
                      <>
                        {row[column.key].slice(0, 30)}
                        {expandedRows.includes(row.id) && row[column.key].slice(30)}
                        <div>
                          <Link onClick={() => toggleExpansion(row.id)} to={""}>
                            {expandedRows.includes(row.id) ? "Скрыть" : "Показать все"}
                          </Link>
                        </div>
                      </>
                    </div>
                  ) : (
                    row[column.key]
                  )}
                </td>
                ))}
                  <td className={styles.table__action}>
                    {/* <EditIcon onClick={() => handleEditButtonClick(row)}/> */}
                    {editableRows!=row.id && (
                      <td className={styles.table__action}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16" onClick={() => handleDeleteButtonClick(row.id)}>
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
                  <Link  to={`/edit/${row.id}`} style={{color:"black"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
                </Link>
                </td>
                    )}
                  {editableRows==row.id && (
                    <td className={styles.table__action}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" onClick={() => {
                      setEditableRows(null);
                      setDictionary({           id: 0,
                        title: "",
                        salary: 0,
                        city: "",
                        company: "",
                        exp: "",
                        image: null,
                        status: "",
                        info: undefined,
                        adress: null,});
                  }}>
                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                  </svg>
                  <span className={styles.header__spacer}>&nbsp;&nbsp;&nbsp;</span> {/* Увеличенный пробел */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16" onClick={() => putVacancy()}>
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                  </svg>

                    </td>
                  )}
                  </td>
                </tr>
              ))}

            </tbody>
          </Table>

  
          <ModalWindow handleBackdropClick={() => {setIsImageModalWindowOpened(false); setSelectedImage(null)}} active={isImageModalWindowOpened } className={styles.modal}>
            <h3 className={styles.modal__title}>Выберите картинку</h3>
            {currentImage && <h4 className={styles.modal__subtitle}>Текущее изображение</h4>}
            <div className={styles.dropzone__container}>
            <div className="dropzone__wrapper">
            <img className={styles.dropzone__image} src={currentImage} alt="" />
            {selectedImage && <p className={styles.dropzone__filename}>Вы загрузили: <b>{selectedImage.name}</b></p>}
            <div></div>
              <input className={styles.dropzone__input} id="upload" type="file" onChange={handleImageChange} />
            </div>
            </div>
            <Button disabled={selectedImage ? false : true} className={styles.dropzone__button} onClick={handleUpload}>Сохранить</Button>
            
          </ModalWindow>
        </div>
      </>
    );
  }
  
  export default CustomTable

