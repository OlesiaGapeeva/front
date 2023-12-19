import React, { ChangeEvent, useState } from 'react'
import axios from 'axios'
import styles from './RespListPage.module.scss'
import Header from '../../components/header'
import ModalWindow from '../../components/ModalWindow/ModalWindow.tsx'
import RespTable from '../../components/RespTable/RespTable.tsx'
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs'
import { useDispatch } from 'react-redux'
import { setCurrentUserFilterAction, setEndilterAction, setRespAction, setStartFilterAction, setStatusFilterAction, useCurrentUserFilter, useEndFilter, useResp, useStartFilter, useStatusFilter } from "../../slices/RespSlices.ts"
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetailedSlices.ts";
import { useIsAdmin } from '../../slices/AuthSlices.ts'
import Form from 'react-bootstrap/Form';
import { Button, Dropdown} from 'react-bootstrap'

const statuses = ["Не выбрано", "Черновик",'Сформировано', "Отклонено", "Одобрено"]

export type ReceivedRespData = {
    user: any
    id: number | null;
    status: string;
    creation_date: string;
    editing_date: string;
    approving_date: string;
    full_name: string;
    suite: number | null;
  }

const RespListPage = () => {
    const dispatch = useDispatch();
    const resp = useResp();
    const linksMap = useLinksMapData();
    const IsAdmin = useIsAdmin();
    const userFilter = useCurrentUserFilter();
    const startTime = useStartFilter();
    const endTime = useEndFilter();
    const statusValue = useStatusFilter();
  

    const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);

    const getAllResp = async () => {
        let res = ''
        console.log("strt end stat", startTime, endTime, statusValue)
        if (startTime && endTime) {
        res += `?start=${startTime}&end=${endTime}`
        } else if(startTime) {
        res += `?start=${startTime}`
        } else if(endTime) {
        res += `?end=${endTime}`
        }
        let trstatus = ''
        if (statusValue) {
            trstatus = getStatusFromTranslation(statusValue)
        }
        
        if (res.length === 0 && statusValue !== 'Не выбрано') {
        res += `?status=${trstatus}`
        } else if (res.length !== 0 && statusValue !== 'Не выбрано'){
        res += `&status=${trstatus}`
        }
        try {
          const response = await axios(`http://localhost:8001/resp/${res}`, {
            method: 'GET',
            withCredentials: true
          });
          console.log(response.data);
          const rawData = response.data;
          let filteredData; // Объявление переменной filteredData перед блоком if-else
          
          if (userFilter) {
            filteredData = rawData
              .filter((raw: ReceivedRespData) => raw.status !== 'delited')
              .filter((raw: ReceivedRespData) => raw.user.full_name.toLowerCase().includes(userFilter.toLowerCase()))
              .map((raw: ReceivedRespData) => ({
                id: raw.id,
                status: getStatusTranslation(raw.status),
                creation_date: raw.creation_date,
                editing_date: raw.editing_date,
                approving_date: raw.approving_date,
                suite: raw.suite,
                full_name: raw.user.full_name
              }));
          } else {
            filteredData = rawData
              .filter((raw: ReceivedRespData) => raw.status !== 'delited')
              .map((raw: ReceivedRespData) => ({
                id: raw.id,
                status: getStatusTranslation(raw.status),
                creation_date: raw.creation_date,
                editing_date: raw.editing_date,
                approving_date: raw.approving_date,
                suite: raw.suite,
                full_name: raw.user.full_name
              }));
          }
      
          dispatch(setRespAction(filteredData));
        } catch(error) {
          throw error;
        }
    }
    const getStatusTranslation = (status: string): string => {
        switch (status) {
            case 'made':
                return 'Сформировано';
            case 'denied':
                return 'Отклонено';
            case 'delited':
                return 'Удалено';
            case 'registered':
                return 'Черновик';
            case 'approved':
                return 'Одобрено';
            // Добавьте другие статусы по мере необходимости
            default:
                return status;
        }
    };

    const getStatusFromTranslation = (translation: string): string => {
        switch (translation) {
          case 'Сформировано':
            return 'made';
          case 'Отклонено':
            return 'denied';
          case 'Удалено':
            return 'delited';
          case 'Черновик':
            return 'registered';
          case 'Одобрено':
            return 'approved';
          // Добавьте другие переводы статусов по мере необходимости
          default:
            return translation;
        }
      };

    React.useEffect(() => {
        dispatch(setLinksMapDataAction(new Map<string, string>([
            ['Отклики', '/responses']
        ])))
        getAllResp()
        // Запуск short polling с интервалом в 5 секунд
        const pollingInterval = setInterval(() => {
          getAllResp();
        }, 5000);
    
        // Остановка short polling при размонтировании компонента
        return () => {
          clearInterval(pollingInterval);
        };
    }, [startTime, endTime, statusValue, userFilter])

    const handleUserValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setCurrentUserFilterAction(event.target.value));
    };

    const handleSearchButtonClick = () => {
        getAllResp();
    };

    const handleCategorySelect = (eventKey: string | null) => {
        if (eventKey !== null) {
          const selectedStatus = statuses.find(status => status === eventKey)
          if (selectedStatus && selectedStatus !== statusValue && selectedStatus) {
            dispatch(setStatusFilterAction(selectedStatus))
          }
        }
    };
    

    return (
        <div className={styles.applications__page}>
            <Header/>
            <div className={styles['applications__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h2 className={styles['applications__page-title']}>История откликов</h2>
                {IsAdmin &&(<Form.Group controlId="name" style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyItems: "center", 
                gap: "20px"
            }}>
                 <div className={styles.form__item}>
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {dispatch(setStartFilterAction(event.target.value))}} value={startTime} className={styles.form__input} type="text" placeholder="Начальная дата (Год-Месяц-День)" />
              </div>
              <div className={styles.form__item}>
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {dispatch(setEndilterAction(event.target.value))}} value={endTime} className={styles.form__input} type="text" placeholder="Конечная дата (Год-Месяц-День)" />
              </div>
              <Dropdown className={styles['dropdown']} onSelect={handleCategorySelect}>
                <Dropdown.Toggle
                    className={styles['dropdown__toggle']}

                >   
                    {statusValue}
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles['dropdown__menu']}>
                    {statuses
                    .map(status => (
                        <Dropdown.Item className={styles['dropdown__menu-item']} key={status} eventKey={status}>
                        {status}
                        </Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                type="text"
                placeholder="Введите имя пользователя"
                style={{
                    backgroundColor: 'rgb(231, 230, 230)',
                    height: '30px',
                    width: '60vw',
                    marginBottom: '40px'
                }}
                value={userFilter} 
                onChange={handleUserValueChange}
                />
            {/* <Button
                variant="primary"
                type="submit"
                style={{
                color: 'white',
                backgroundColor: 'rgb(0, 102, 255)',
                border: 'none',
                height: '30px',
                fontSize: '15px',
                borderRadius: '10px',
                width: '200px',
               
                fontFamily: 'sans-serif',
                justifyContent: 'center', // Center the text horizontally
                alignItems: 'center', // Center the text vertically
                marginBottom: '40px'
                }}
                onClick={() => handleSearchButtonClick()}
            >
                Поиск
            </Button> */}
            </Form.Group>)}
                
                <RespTable resp={resp}/>
            </div>
        </div>
    )
}

export default RespListPage