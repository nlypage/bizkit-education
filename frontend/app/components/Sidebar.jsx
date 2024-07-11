import { UserRound, SquareArrowLeft, BookText, Radio, MessageCircleQuestion, CircleHelp, TvMinimalPlay, MailQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles/Sidebar.module.css"

const Sidebar = ({ setView }) => {
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    router.push("/login");
  };

  return (
    <div className={styles.sidebar_box}>
      <nav className={styles.sidebar_nav}>

        <div className={styles.sidebar_button_box}>
          {/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="27" height="27" viewBox="0 0 24 24"          style={{fill: "#7950F2;"}}>
            <path d="M 4.2246094 4.2246094 C 2.2336094 6.2166094 1 8.967 1 12 C 1 15.033 2.2336094 17.783391 4.2246094 19.775391 L 5.6386719 18.361328 C 4.0086719 16.731328 3 14.481 3 12 C 3 9.519 4.0086719 7.2686719 5.6386719 5.6386719 L 4.2246094 4.2246094 z M 19.775391 4.2246094 L 18.361328 5.6386719 C 19.991328 7.2686719 21 9.519 21 12 C 21 14.481 19.991328 16.731328 18.361328 18.361328 L 19.775391 19.775391 C 21.766391 17.783391 23 15.033 23 12 C 23 8.967 21.766391 6.2166094 19.775391 4.2246094 z M 7.0527344 7.0527344 C 5.7847344 8.3197344 5 10.07 5 12 C 5 13.93 5.7847344 15.680266 7.0527344 16.947266 L 8.4667969 15.533203 C 7.5607969 14.628203 7 13.378 7 12 C 7 10.622 7.5617969 9.3727969 8.4667969 8.4667969 L 7.0527344 7.0527344 z M 16.947266 7.0527344 L 15.533203 8.4667969 C 16.439203 9.3717969 17 10.622 17 12 C 17 13.378 16.438203 14.627203 15.533203 15.533203 L 16.947266 16.947266 C 18.214266 15.679266 19 13.93 19 12 C 19 10.07 18.215266 8.3197344 16.947266 7.0527344 z M 12 9 A 3 3 0 0 0 12 15 A 3 3 0 0 0 12 9 z"></path>
          </svg> */}
          <UserRound size={27} color="#7950F2"/>
          <button onClick={() => setView("profile")} className={styles.sidebar_button}>
            <p>Профиль</p>
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>
        
        <div className={styles.sidebar_button_box}>
          <MessageCircleQuestion size={27} color="#7950F2"/>
          <button onClick={() => setView("question")} className={styles.sidebar_button}>
            <p>Задать вопрос</p>
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>
        
        <div className={styles.sidebar_button_box}>
          <CircleHelp size={27} color="#7950F2"/>
          <button onClick={() => setView("answer")} className={styles.sidebar_button}>
            <p>Смотреть вопросы</p>
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>
        
        <div className={styles.sidebar_button_box}>
         <MailQuestion size={27} color="#7950F2"/>
          <button onClick={() => setView("userquestion")} className={styles.sidebar_button}>
            <p>Мои вопросы</p>
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>
        
        <div className={styles.sidebar_button_box}>
          <TvMinimalPlay size={27} color="#7950F2"/>
          <button onClick={() => setView("shedule")} className={styles.sidebar_button}>
            <p>Эфиры</p>
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>

        <div className={styles.sidebar_button_box}>
          <Radio size={27} color="#7950F2"/>
          <button onClick={() => setView("card")} className={styles.sidebar_button}>
            <p>Карта</p>
          </button>
          <hr className={styles.sidebar_hr} />
        </div>

        <div className={styles.sidebar_button_box}>
          <BookText size={27} color="#7950F2"/>
          <button onClick={() => setView("description")} className={styles.sidebar_button}>
            Про проект
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>
        <div className={styles.sidebar_button_box}>
          <SquareArrowLeft size={27} color="#7950F2"/>
          <button onClick={handleLogout} className={styles.sidebar_button}>
            Выйти
          </button>
          <hr className={styles.sidebar_hr} style={{size:"5"}}/>
        </div>
        
      </nav>
    </div>
  );
};

export default Sidebar;
