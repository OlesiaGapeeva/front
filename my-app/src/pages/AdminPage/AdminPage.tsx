import { useDispatch } from "react-redux";
import { setTitleValueAction, useTitleValue, useVacancies } from "../../slices/MainSlice";
import { useState } from "react";
import React from "react";
import Header from "../../components/header";
import styles from '/home/student/pythonProjects/my-app/src/pages/AdminPage/AdminPage.module.scss'
import CustomTable from "../../components/CustomTable/CustomTable";

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
const columns = [
    {
        key: 'title',
        title: 'Вакансия'
    },
    {
        key: 'salary',
        title: 'Зарплата'
    },
    {
        key: 'city',
        title: 'Город'
    },
    {
        key: 'adress',
        title: 'Адрес'
    },
    {
        key: 'company',
        title: 'Компания'
    },
    {
        key: 'exp',
        title: ' Опыт'
    },
    {
        key: 'info',
        title: 'Информация'
    },

]

const AdminPage = () => {
    const dispatch = useDispatch()
    const vacancies = useVacancies()

    
    React.useEffect(() => {
    }, [])

    return (
        <div className={styles.admin__page}>
            <Header/>
    
            <div className={styles['admin__page-wrapper']}>
                <h1 className={styles['admin__page-title']}>Вакансии</h1>
    
                <div className={styles['admin__page-title']}>
                    <CustomTable className={styles['admin__page-table']} data={vacancies} columns={columns}
                    flag={2} ></CustomTable>
                    
                    
                </div>
                        
            </div>
        </div>
      )
    }
    
    export default AdminPage