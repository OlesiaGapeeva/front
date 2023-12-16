import styles from './DetaliedPage.module.scss'
import { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header';
import Card from 'react-bootstrap/Card';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { useVacancy, useLinksMapData, setVacancyAction, setLinksMapDataAction } from "../../slices/DetailedSlices.ts"
import {useDispatch} from "react-redux";
import axios from 'axios';


export type Vacancies = {
    id: number,
    title: string,
    adress?: string |null,
    time: string,
    salary: number,
    company: string,
    city?: string | null,
    exp: string,
    image?: string | null,
    info?: string,
    status: string
}

export type ReceivedVacancyData = {
    id: number,
    title: string,
    salary: number,
    city: string,
    company: string,
    exp: string | undefined | null,
    image: string | undefined | null;
}

const mockVacancies = [
    {'title': 'Копирайтер', 'adress': 'Алексеевская', 'time':'Полный день', 'salary': 50000, 'company': 'Копи-копи', 'city': 'Москва', 'exp': 'Без опыта', 'image': "https://w7.pngwing.com/pngs/299/589/png-transparent-social-media-computer-icons-technical-computer-network-text-computer.png", 'id': 1, 'status': 'enabled', 'info': 'Компания "Копи-копи" стремится к совершенству и инновациям. Ее команда талантливых копирайтеров постоянно ищет новые способы выразить идеи и повысить эффективность коммуникации. С каждым текстом, созданным "Копи-копи", они продолжают укреплять свою репутацию как надежного партнера, который доставляет не только качественные тексты, но и вдохновение, которое воплощается в каждом слове.','requirements' :['Отличное владение русским языком', 'Умение писать грамотные тексты', 'Креативность и внимательность к деталям'], 'conditions': ['Гибкий график работы', 'Возможность удаленной работы', 'Оплачиваемый отпуск', 'Профессиональное развитие и обучение', 'Дружеская и поддерживающая рабочая атмосфера']},
    {
    'title': 'Менеджер блогера',
    'adress': 'Алтуфьевское шоссе, 12',
    'time': 'Сменный график',
    'salary': 10000,
    'company': 'Co_blog',
    'city': 'Москва',
    'exp': 'От года',
    'image': null,
    'id': 2,
    'status': 'enabled',
    'info': 'Компания Co_blog - это легендарный блогинговый ресурс, который начал свою деятельность двадцать лет назад в гараже основателя. С течением времени они стали одной из самых влиятельных и популярных платформ для блогеров. Co_blog известен своим инновационным подходом к созданию контента и использованию социальных сетей для его продвижения. Сотрудники компании являются настоящими экспертами в области блогинга и имеют огромную базу фанатов и подписчиков, которые следят за их публикациями. Co_blog стал не только платформой для создания и обмена контентом, но и местом, где талантливые блогеры могут раскрыть свой потенциал и достичь большого успеха.',
    },
    {
    'title': 'Куратор',
    'salary': 7000,
    'time': 'Удаленная работа',
    'company': 'Вебскул',
    'image': 'https://cdn1.dizkon.ru/images/contests/2017/08/15/5992c98e5cd2e.700x534.80.jpg',
    'exp': 'Без опыта',
    'id': 3,
    'status': 'enabled',
    'info': 'Вебскул - компания, которая изменила пейзаж онлайн-образования. Они были основаны группой страстных преподавателей и разработчиков, которые верили в доступность и качество образования для всех. Вебскул разработал инновационную веб-платформу, которая объединяет учителей и учеников со всего мира. С помощью передовых технологий и интерактивных методик обучения, Вебскул предлагает образовательные курсы в различных областях знаний. Компания стремится изменить способ, которым люди учатся и развиваются, и дает возможность каждому раскрыть свой потенциал независимо от места проживания или времени.',
    },
    {
    'title': 'Редактор',
    'salary': 20000,
    'time': 'Удаленная работа',
    'company': 'Новая газета',
    'city': 'Москва',
    'exp': 'Без опыта',
    'id': 4,
    'status': 'enabled',
    'info': 'Новая газета - это историческое издание, которое существует уже более ста лет. Они являются одним из самых авторитетных и влиятельных печатных изданий в стране. Новая газета всегда была символом независимой журналистики и свободы слова. Их журналисты и редакторы известны своей профессиональностью, точностью и честностью в отношении информации, которую они предоставляют своим читателям. Новая газета активно освещает важные события и проблемы общества, их репортажи и статьи часто становятся объектом обсуждения и влияют на общественное мнение.',
    }
]


const VacancyPage = () => {  
  const dispatch = useDispatch();
  const vacancy = useVacancy();
  const linksMap = useLinksMapData();

  console.log("Линк", linksMap)


  const params = useParams();
  const id = params.id === undefined ? '' : params.id;
//   const [linksMap, setLinksMap] = useState<Map<string, string>>(
//     new Map<string, string>([['Вакансии', '/vacancies']])
// );
  // const [vacancy, setVacancy] = useState<Vacancies>();
  // let currentUrl = '/'

  const fetchVacancy = async () => {
      try {
          const response = await axios.get(`http://localhost:8001/vacancies/${id}`);
          const jsonData = await response.data;
          dispatch(setVacancyAction({
            id: Number(jsonData.id),
            title: jsonData.title,
            adress: jsonData.adress,
            time: jsonData.time,
            salary: Number(jsonData.salary),
            company: jsonData.company,
            city: jsonData.city,
            exp: jsonData.exp,
            image: jsonData.image,
            info: jsonData.info,
            status: jsonData.status
          }))
          const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
            newLinksMap.set(jsonData.title, '/vacancies/' + id);
            dispatch(setLinksMapDataAction(newLinksMap))
      } catch {
          const vacancy = mockVacancies.find(item => item.id === Number(id));
          //const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
          if (vacancy) {
            //newLinksMap.set(vacancy.title, '/vacancies/' + id);
            dispatch(setVacancyAction(vacancy))
          }
          //setVacancy(vacancy)
      }
      
      //currentUrl += 'vacancies/' + id
  };
  useEffect(() => {
      fetchVacancy();
      // console.log(currentUrl)
      return () => { // Возможно лучше обобщить для всех страниц в отдельный Slice !!!
        dispatch(setLinksMapDataAction(new Map<string, string>([['Вакансии', '/vacancies']])))
      }
  }, []);

  // const postVacancyToResp = async (id: number) => {
  //   try {
  //       const response = await axios(`http://localhost:8001/vacancies/${id}/add/`, {
  //           method: 'POST',
  //           withCredentials: true,
  //       })
  //       const addedVacancy= {
  //           id: response.data.id,
  //           title: response.data.title,
  //           image: response.data.image,
  //           company: response.data.company,
  //           salary: response.data.salary,
  //           city: response.data.city,
  //           exp: response.data.exp,
  //           status: response.data.status
  //       }
  //       dispatch(setVacancyFromRespAction([...vacancyFromResp, addedVacancy]))
  //       toast.success("Вакансия успешно добавлена в отклик!");
  //   } catch (error) {
  //       if (error instanceof Error) {
  //           // Если error является экземпляром класса Error
  //           toast.error("Вы не авторизированны");
  //       } else {
  //           // Если error не является экземпляром класса Error (что-то другое)
  //           toast.error('Вакансия уже добавлена в отклик');
  //       }
  //   }
  // }

  return (
    <div className={styles.Detalied_Page}>
      <Header/>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb" style={{ marginTop: '58px' , height: '26px',  backgroundColor: 'white'}}>
                    <div style={{marginLeft: '2vw'}}>
                    <BreadCrumbs links={linksMap}/>
                    </div>
                    </ol>
                </nav>
        <div className={styles.info}>
        <Card className={styles.card}>
        <div>
        </div>
      
      <Card.Body>
        <div>
        <h2 style={{ paddingLeft: '20px' }}>{vacancy?.title}</h2>
            <h3 style={{ paddingLeft: '20px' }}>{vacancy?.salary}</h3>         
        </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7 px', paddingLeft: '20px'}}>
        Требуемый опыт: {vacancy?.exp}
      </span>
      <p></p>
      <div style={{ paddingLeft: '20px' }}>
      {/* <button type="button" className={styles.btn_apply} onClick={() => postVacancyToResp(vacancy.id)} >Откликнуться</button> */}
      </div>
        <div className='mt-auto'>
        </div>
      </Card.Body>
    </Card>
    <Card className={styles.card}>
      <Card.Body>
        <h2 style={{ paddingLeft: '20px' }}>{vacancy?.company}</h2>        
        {vacancy?.city && (
  <div className="card-text" style={{ paddingLeft: '20px' }}>
    <p>{`${vacancy.city}${vacancy.adress ? `, ${vacancy.adress}` : ''}`}</p>
  </div>
)}
      <p></p>
      {vacancy?.image && vacancy.image !== null && vacancy.image !== '' && (
  <img className={styles.image} src={vacancy.image} />
)}
      <div style={{ paddingLeft: '20px' }}>
      </div>
        <div className='mt-auto'>
        </div>
      </Card.Body>
    </Card>
    <div className={styles.container}>
  <div className={styles.centeredContent}>
    <span></span>
    <div></div> 
    <span className={styles.card_text}>{vacancy?.info}</span>
  </div>
</div>
        </div>
    </div>
  );
}

export default VacancyPage;