import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './SelectedApplicationPage.module.scss'
import Header from '../../components/header/header';
import VacancyTable from '../../components/VacTable/VacTable';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { useDispatch } from 'react-redux';
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetailedSlices.ts";
import { toast } from 'react-toastify';
import { setVacancyFromRespAction, setCurrentRespDateAction, setCurrentRespIdAction, useCurrentRespId, useVacancyFromResp } from '../../slices/RespSlices.ts';
import { Button } from 'react-bootstrap';

export type ReceivedVacancyData = {
  id: number,
  title: string,
  salary: number,
  city: string,
  company: string,
  exp: string | undefined | null,
  image: string | undefined | null;
  status:string;
}


const SelectedRespPage = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;
    const currentRespId = useCurrentRespId()
    // const [currentVac, setCurrentVac] = React.useState([])
    const dispatch = useDispatch();
    const linksMap = useLinksMapData();
    const [currentStatus, setCurrentStatus] = React.useState("начало")

    const getCurrentResp = async () => {
        try {
          const resp = await axios(`http://localhost:8001/resp/${id}/`, {
            method: 'GET',
            withCredentials: true,
          })
          console.log("Мы получили  отвкт", resp);
          setCurrentStatus(resp.data.response.status)
          const newArr = resp.data.vacancies.map((raw: ReceivedVacancyData) => ({
            id: raw.id,
                title: raw.title,
                salary: raw.salary,
                city: raw.city,
                company: raw.company,
                image: raw.image,
                exp: raw.exp,
                status: raw.status
            }));
        dispatch(setVacancyFromRespAction(newArr))
        // setCurrentVac(newArr)
        } catch(error) {
          throw error;
        }
      }
      const hr = async () => {
        console.log("мы получили",id)
        // axios.get('http://localhost:8001/async_task', {
        //         params: {
        //           resp_id: id // Значение resp_id, которое нужно передать
        //         }
        //       })
        //         .then(response => {
        //           // Обработка успешного ответа
        //           dispatch(setCurrentRespIdAction(undefined));
        //           console.log(response.data); // Вывод ответа в консоль
        //         })
        //         .catch(error => {
        //           // Обработка ошибки
        //           console.error(error);
        //         });
        try {
          axios(`http://localhost:8001/async_task/${id}`, {
                method: 'GET',
                withCredentials: true,
          });
          console.log("отправили запрос")
          dispatch(setCurrentRespIdAction(undefined));
        } catch(error) {
          console.log("ЧТо-то пошло не так")
        }
      }
      
      const sendResp = async () => {
        try {
          await axios(`http://localhost:8001/resp/made/`, {
            method: 'PUT',
            withCredentials: true
          })
    
          dispatch(setVacancyFromRespAction([]));
          dispatch(setCurrentRespDateAction(''));
          // dispatch(setCurrentRespIdAction(undefined));
          localStorage.setItem('vacancyFromResp', JSON.stringify([]));
          // dispatch(setCurrentRespIdAction(null));
          setCurrentStatus("made")
          toast.success("Отправлено на проверку модератору");
        } catch(error) {
          throw error;
        }
      }
    
      const deleteResp = async () => {
        try {
          await axios(`http://localhost:8001/resp/delete`, {
          method: 'DELETE',
          withCredentials: true
        })
    
        dispatch(setVacancyFromRespAction([]));
        dispatch(setCurrentRespDateAction(''));
        dispatch(setCurrentRespIdAction(undefined));
        localStorage.setItem('vacancyFromResp', JSON.stringify([]));
        toast.success("Отклик удален");
        setCurrentStatus("deleted")
        }
        catch(error) {
          throw error;
        }
        
      }
    
      const handleSendButtonClick = () => {
        sendResp();
        hr();
        getCurrentResp();
      }
    
      const handleDeleteButtonClick = () => {
        deleteResp();
      }
    

    React.useEffect(() => {
        const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
        newLinksMap.set("Детали отклика", '/resp/' + id);
        dispatch(setLinksMapDataAction(newLinksMap))
        getCurrentResp();
        console.log("Статус в стаут", currentStatus)
    }, [id])

    const currentVac = useVacancyFromResp()

    return (
        <div className={styles.application__page}>
            <Header/>
            <div className={styles['application__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h1 className={styles['application__page-title']}>
                    Добавленные вакансии
                </h1>
                {currentStatus != 'deleted' ? <div>
                <div style={{justifyContent: "center"}}>
                <VacancyTable
                  flag={currentStatus !== "registered"}
                  vacancies={currentVac}
                  className={styles["application__page-info-table"]}
                />
                </div>
                <div className={styles['application__page-info-btns']}>
                <Button onClick={() => handleSendButtonClick()} className={styles['application__page-info-btn']} style={{ display: currentStatus === 'registered' ? 'block' : 'none' }}>Отправить</Button>
              <Button onClick={() => handleDeleteButtonClick()} className={styles['application__page-info-btn']} style={{ display: currentStatus === 'registered' ? 'block' : 'none' }}>Удалить</Button>
            </div>
            </div>
        : <h5 className={styles['application__page-subtitle']}>
            В отклике нет вакансий
          </h5>
          }
            </div>
        </div>
    )
}

export default SelectedRespPage