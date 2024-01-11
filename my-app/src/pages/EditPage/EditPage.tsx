import { useDispatch } from "react-redux";
import { setTitleValueAction, setVacanciesAction, useTitleValue, useVacancies } from "../../slices/MainSlice";
import { ChangeEvent, useState } from "react";
import React from "react";
import Header from "../../components/header";
import CustomTable from "../../components/CustomTable/CustomTable";
import axios from "axios";
import { toast } from "react-toastify"
import styles from './EditPage.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";


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

const EditPage = () => {
    const params = useParams();
    const id = params.id || 0; // Можно использовать оператор || для проверки, если params.id равно undefined, то присвоить пустую строку
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const vacancies = useVacancies();
    const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false); // Исправлено: добавлено ключевое слово "const" перед setIsImageModalWindowOpened
    const [currentVacanciesId, setCurrentVacanciesId] = useState<number>();
    const [createRow, setCreateRow] = useState<boolean>(id === '0'); // Установка значения по умолчанию false для createRow
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState('')
    const [dictionary, setDictionary] = useState<VacancyData>({
      id: 0,
      title: "",
      salary: 0,
      city: "",
      company: "",
      exp: "",
      status: "",
      info: undefined,
      adress: null,

    })

    
const selectedVacancy = vacancies.find(vacancy => vacancy.id == id);

    
    React.useEffect(() => {
      if (selectedVacancy) {
        setDictionary(selectedVacancy)
        setCurrentImage(selectedVacancy.image || '')
        setCurrentVacanciesId(selectedVacancy.id)
        }
    }, [])

    const handleUpload = async (id: number) => {
        console.log("Грузим изображение")
        console.log("Проверка загрузки изображения", selectedImage)
        if (selectedImage) {
          console.log("Зашли")
          try {
            const formData = new FormData();
            formData.append('file', selectedImage);
    
            const response = await axios.post(
              `http://localhost:8001/vacancies/${id}/image`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
              }
            );
            const updatedVacancies = vacancies.map(vacancy => {
              if (vacancy.id === id) {
                return {
                  ...vacancy,
                  image: response.data.image
                };
              }
              return vacancy;
            });
            
            if (!updatedVacancies.some(vacancy => vacancy.id === id)) {
              const newVacancy = {
                id: response.data.id,
                title: response.data.title,
                salary: response.data.salary,
                city: response.data.sity,
                company: response.data.company,
                image: response.data.image,
                exp: response.data.exp,
                status: response.data.status,
                info: response.data.info,
                address: response.data.adress,
              };
            
              updatedVacancies.push(newVacancy);
            }
            
            dispatch(setVacanciesAction(updatedVacancies));
            console.log(updatedVacancies)
            setSelectedImage(null)
            toast.success('Изображение успешно загружено')
    
          } catch (error) {
            console.error('Error uploading image:', error);
          } 
        }
      };

  
    
   
      const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedImage(file);
        }
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
          const response = await axios.post('http://localhost:8001/vacancies/post', {
            title: dictionary.title,
            salary: dictionary.salary,
            info: i,
            city: dictionary.city,
            adress: dictionary.adress,
            exp: dictionary.exp,
            company: dictionary.company
          }, {
            withCredentials: true
          });
        
          console.log(response);
        
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
            address: raw.adress
          }));
          

          dispatch(setVacanciesAction(newArr));
          

          

          const maxId: number = newArr.reduce((max: number, dict: ReceivedVacancyData) => {
            return dict.id > max ? dict.id : max;
          }, 0);
          handleUpload(maxId);
        
          setCreateRow(false)
          setDictionary({
            id: 0,
            title: "",
            salary: 0,
            city: "",
            company: "",
            exp: "",
            status: "",
            info: undefined,
            adress: null,
          });
          toast.success('Вакансия добавлена');
          navigate('/employee');
        } catch (e) {
          toast.error('Ошибка');
          throw e;
        }
        console.log('Этот console.log должен выполняться');
      }
  
    const putVacancy = async () => {
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
        handleUpload(dictionary.id);
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
        navigate('/employee');
      } catch(e) {
        toast.error('Такая вакансия уже существует!')
        throw e
      }
  }
  
  
  const handleSaveButtonClick = () => {
    postVacancy()
    //handleUpload()
  }

return (
    <div className={styles.admin__page}>
        <Header/>
  <div style={{display: "flex", marginTop: '70px'}}>
    <div>
      {!createRow && (
        <>
      <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['title']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        value={dictionary.title}
        placeholder="Название*"
        required
      />
    </div>

    <div>
      <input
        type="number"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['salary']: Number(event.target.value)
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Зарплата*"
        value={dictionary.salary}
        required
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['city']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Город*"
        value={dictionary.city || ''}
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['adress']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Полный адрес"
        value={createRow ? '' : (dictionary.adress || '')}
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['company']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Компания*"
        required
        value={createRow ? '' : dictionary.company}
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['exp']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Опыт работы*"
        value={createRow ? '' : dictionary.exp}
      />
    </div>

    <div>
      <textarea
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['info']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Дополнительная информация"
        value={createRow ? '' : dictionary.info}
      />
    </div>
    </>)}
    {createRow && (
        <>
      <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['title']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Название*"
        required
      />
    </div>

    <div>
      <input
        type="number"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['salary']: Number(event.target.value)
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Зарплата*"
        required
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['city']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Город*"
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['adress']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Полный адрес"
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['company']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Компания*"
        required
      />
    </div>

    <div>
      <input
        type="text"
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['exp']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Опыт работы*"
      />
    </div>

    <div>
      <textarea
        onChange={(event) => {
          const updatedDictionary = {
            ...dictionary,
            ['info']: event.target.value
          };
          setDictionary(updatedDictionary);
        }}
        placeholder="Дополнительная информация"
      />
    </div>
    </>)}
    
    </div>

    {/* Добавьте остальные поля */}
    
  
    <div className={styles.container}>
    <div className={styles.content}>
      <h3 className={styles.modal__title}>Выберите картинку</h3>
      {currentImage && <h4 className={styles.modal__subtitle}>Текущее изображение</h4>}
      <div className={styles.dropzone__container}>
        <div className="dropzone__wrapper">
        {currentImage && <img className={styles.dropzone__image} src={currentImage} alt="" />}
          {selectedImage && <p className={styles.dropzone__filename}>Вы загрузили: <b>{selectedImage.name}</b></p>}
          <div></div>
          <input style={{marginLeft: 0}} className={styles.dropzone__input} id="upload" type="file" onChange={handleImageChange} />
        </div>
      </div>
      {/* <Button disabled={selectedImage ? false : true} className={styles.dropzone__button} onClick={handleUpload}>Сохранить</Button> */}
    </div>
      </div>
      </div>

      <div style={{justifyContent:"center", textAlign: "center", marginLeft: "auto", marginRight: "auto", marginTop: "-15px"}}>
      {createRow && (<Button type='submit' className='btn' style={{fontSize: '18px',marginLeft: '0', marginTop: '0px', marginRight: '15px'}} onClick={() => handleSaveButtonClick()}>
        Сохранить</Button>
      )}
      {!createRow && (<Button type='submit' className='btn' style={{fontSize: '18px',marginLeft: '0', marginTop: '0px', marginRight: '15px'}} onClick={() => putVacancy()}>
        Сохранить</Button>)}
      <Button className='btn' style={{fontSize: '18px', marginTop: '0px', marginRight: '15px'}} onClick={() => {
        setCreateRow(false);
        setDictionary({
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
      }}>
        <Link to={`/employee`} style={{color:"white", textDecoration: 'none'}}>Отменить</Link></Button>
    </div>
</div>

  )
}
    export default EditPage;