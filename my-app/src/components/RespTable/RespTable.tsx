import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import styles from './RespTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalWindow from '../ModalWindow/ModalWindow.tsx';
import cn from 'classnames';

import { Link } from 'react-router-dom';
import { useIsAdmin } from '../../slices/AuthSlices.ts';
import { toast } from 'react-toastify';


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
  const IsAdmin = useIsAdmin();

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

  const Putstatus = async (id: number | null, st: string) => {
    const data = {status: st };
    try {
      const response = axios(`http://localhost:8001/resp/${id}/confirm/`, {
        method: 'PUT',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      })

      console.log(response)

      toast.success("Статус изменен");
    } catch(error) {
      throw error;
    }
  }


  const handleConfirmResponse = (id: number | null, status: string) => {
    Putstatus(id, status)
};

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
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody style={{alignItems:"center"}}>
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
                <Button style={{alignItems:"center"}}>Подробнее</Button>
                </Link>
                {/* <Button onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button> */}
              </td>
              {IsAdmin && res.status == 'Сформировано' && (<td className={styles.table__action}>
    <Button onClick={() => handleConfirmResponse(res.id, 'approved')}     style={{
                    backgroundColor: 'rgb(231, 230, 230)',
                    borderColor:"gray",
                    borderRadius:"8px",
                    height: "30px",
                    justifyContent: "center",
                    marginBottom:"3px"
                    
                }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="gray" className="bi bi-check-lg" viewBox="0 4 16 16" >
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022"/>
</svg>
    </Button>
    <div>
    <Button onClick={() => handleConfirmResponse(res.id, 'denied')}  style={{
                    backgroundColor: 'rgb(231, 230, 230)',
                    borderColor:"gray",
                    borderRadius:"8px",
                    height: "30px",
                    justifyContent: "center"
                    
                }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" className="bi bi-check-lg" viewBox="-2 3 20 20">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
    </Button>
    </div>
</td>)
              }
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </>
  );
}

export default RespTable