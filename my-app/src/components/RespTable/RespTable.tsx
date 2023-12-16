import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import styles from './RespTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalWindow from '../ModalWindow/ModalWindow.tsx';
import cn from 'classnames';

import { Link } from 'react-router-dom';


interface RespData {
  id: number | null;
  status: string;
  creation_date: string;
  editing_date: string;
  approving_date: string;
  full_name: string;
  suite: number | null;
}

interface VacancyData {
    id: number,
    title: string,
    salary: number,
    company: string,
    exp: string | undefined | null,
}

export type ReceivedVacancyData = {
    id: number,
    title: string,
    salary: number,
    company: string,
    exp: string | undefined | null,
}

export type VacancyTableProps = {
  resp: RespData[];
  className?: string;
};

const RespTable: React.FC<VacancyTableProps> = ({resp, className}) => {
  //const dispatch = useDispatch();
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
  const [currentVacancies, setCurrentVacancies] = useState<VacancyData[]>([])

  async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/resp/${id}`, {
        method: 'GET',
        withCredentials: true,
      })
      const newArr = response.data.response.map((raw: ReceivedVacancyData) => ({
        id: raw.id,
        title: raw.title,
        salary: raw.salary,
        company: raw.company,
        exp: raw.exp,
    }));
    setCurrentVacancies(newArr)
    } catch(error) {
      throw error;
    }
  }

  // const handleDetailedButtonClick = (id: number) => {
  //   getCurrentResp(id);
  //   setIsModalWindowOpened(true)
  // };

  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата изменения</th>
            <th>Дата завершения</th>
            <th>Соискатель</th>
            <th>Результат ревью</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resp.map((res: RespData, index: number) => (
            <tr key={res.id}>
              <td>{res.id}</td>
              <td>{res.status}</td>
              <td>{new Date(res.creation_date).toLocaleString()}</td>
              <td>{res.editing_date ? new Date(res.editing_date).toLocaleString(): '-'}</td>
              <td>{res.approving_date ? new Date(res.approving_date).toLocaleString()  : '-'}</td>
              <td>{res.full_name}</td>
              <td>{res.suite}</td>
              <td className={styles.table__action}>
                <Link to={`/resp/${res.id}`}>
                <Button>Подробнее</Button>
                </Link>
                {/* <Button onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
      <h3 className={styles.modal__title}>Добавленные вакансии</h3>
      <div className={styles.modal__list}>
        {currentVacancies.map((vacancy: VacancyData) => (
          <div className={styles['modal__list-item']}>
            <div className={styles['modal__list-item-title']}>
              {vacancy.title} "{vacancy.title}"
            </div>
            <b>{vacancy.company}</b>
          </div>
        ))}
      </div>
      </ModalWindow>
    </>
  );
}

export default RespTable