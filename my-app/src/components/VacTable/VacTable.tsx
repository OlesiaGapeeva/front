import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './VacTable.module.scss'
import Table from 'react-bootstrap/Table';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import BasketIcon from '../../components/Icons/ArrowIcon/BasketIcon';
import { useVacancyFromResp,setVacancyFromRespAction} from "../../slices/RespSlices.ts";


interface VacancyData {
  id: number,
  title: string,
  salary: number,
  company: string,
  exp: string | undefined | null,
}

export type VacTableProps = {
  vacancies: VacancyData[];
  className?: string;
  flag?: boolean;
};

const VacancyTable: React.FC<VacTableProps> = ({vacancies, className, flag}) => {
  const dispatch = useDispatch();
  const vacan = useVacancyFromResp()
  // const isUserAuth = useIsAuth();

  const deleteVacancyFromResp = async (id: number) => {
    try {
      axios(`http://localhost:8001/rv/${id}/`, {
        method: 'DELETE',
        withCredentials: true
      })


      dispatch(setVacancyFromRespAction(vacan.filter(vacancy => vacancy.id !== id)))
      localStorage.setItem('vacancyFromResp', JSON.stringify([]));
      toast.success("Вакансия удалена");
    } catch(error) {
      console.log("ЧТо-то пошло не так")
    }
  }


  const handleDeleteButtonClick = (id: number) => {
    console.log("Мы Решили удалить что-то", id)
    deleteVacancyFromResp(id)
  }

  return (
    <div className={styles.table__container}>
      <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Название</th>
            <th>Компания</th>
            <th>Зарплата</th>
            {!flag && <th></th>}
          </tr>
        </thead>
        <tbody>
          {vacancies.map((vacancy: VacancyData, index: number) => (
            <tr key={vacancy.id}>
              <td>{++index}</td>
              <td>{vacancy.title}</td>
              <td>{vacancy.company}</td>
              <td>{vacancy.salary} ₽</td>
              {!flag && <td className={styles.table__action}><BasketIcon onClick={() => handleDeleteButtonClick(vacancy.id)}/></td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default VacancyTable