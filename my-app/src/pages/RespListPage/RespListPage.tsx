import React, { useState } from 'react'
import axios from 'axios'
import styles from './RespListPage.module.scss'
import Header from '../../components/header'
import ModalWindow from '../../components/ModalWindow/ModalWindow.tsx'
import RespTable from '../../components/RespTable/RespTable.tsx'
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs'
import { useDispatch } from 'react-redux'
import { setRespAction, useResp } from "../../slices/RespSlices.ts"
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetailedSlices.ts";

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
    const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);

    const getAllResp = async () => {
        try {
          const response = await axios('http://localhost:8001/resp/', {
            method: 'GET',
            withCredentials: true
          })
          console.log(response.data)
          const newArr = response.data
          .filter((raw: ReceivedRespData) => raw.status != 'delited')
          .map((raw: ReceivedRespData) => ({
            id: raw.id,
            status: getStatusTranslation(raw.status),
            creation_date: raw.creation_date,
            editing_date: raw.editing_date,
            approving_date: raw.approving_date,
            suite:raw.suite,
            full_name:raw.user.full_name
        }));
        dispatch(setRespAction(newArr))
        } catch(error) {
          throw error
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
                return 'Зарегистрировано';
            case 'approved':
                return 'Подтверждено';
            // Добавьте другие статусы по мере необходимости
            default:
                return status;
        }
    };

    React.useEffect(() => {
        dispatch(setLinksMapDataAction(new Map<string, string>([
            ['Отклики', '/responses']
        ])))
        getAllResp()
    }, [])
    
    return (
        <div className={styles.applications__page}>
            <Header/>
            <div className={styles['applications__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h1 className={styles['applications__page-title']}>История ваших откликов</h1>
                <h5 className={styles['applications__page-subtitle']}>
                Вы можете посмотреть информацию о каждом отклике, а также добавленные в него вакансии
                </h5>
                <RespTable resp={resp}/>
                <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
                    <h3 className={styles.modal__title}>Регистрация прошла успешно!</h3>
                </ModalWindow>
            </div>
        </div>
    )
}

export default RespListPage