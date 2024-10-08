"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../utils/api";
import MyConference from "./elements/MyConference";
import AllConferences from "./elements/AllConferences";
import styles from "./styles/Schedule.module.css"
import DefaultInput from "./ui/defaultInput";
import OpacitedButton from "./ui/opacitedButton";
import PurpleButton from "./ui/purpleButton";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
const useClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback()
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    return () => {
      
      document.removeEventListener("mousedown", handleClick) 
    }
  })
}

const Schedule = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [conference, setConferences] = useState('')
  const handleCreateConference = () => {
    setShowModal(true);
  };
  const menuRef = useRef(null)
  useClickOutside(menuRef, () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
    setTime("");
  })

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
    setTime("");
  };

  const handleSubmit = async () => {
    const data = { title, description, start_time: time };
    console.log(data);
    handleCloseModal();
    try {
      const response = await fetchWithAuth(
        "https://bizkit.fun/api/v1/conference/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setConferences([data, ...conference]);
        handleCloseModal();
        Toastify({
          text: 'Лекция успешно добавлена, обновите страницу',
          duration: 3000,
          newWindow: true,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#7950F2",
            width: '100%'
          },
          onClick: function() {}
        }).showToast();
      } else {
        console.error("Error submitting conference:", response.status);
        Toastify({
          text: 'Произошла ошибка',
          duration: 3000,
          newWindow: true,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#7950F2",
            width: '100%'
          },
          onClick: function() {}
        }).showToast();
      }
    } catch (error) {
      console.error("Error submitting conference:", error);
    }
  };


  return (
    <>
    <div style={{width: "60%", margin: "auto", marginTop: "100px", textAlign: "center" }} className={styles.classes} id="cb" >
      <PurpleButton onClick={handleCreateConference} title={"Создать конференцию"}></PurpleButton>
    </div>
    <div style={{width: "60%", margin: "auto", marginTop: "20px", textAlign: "center" }} className={styles.classes} id="cb" >
      <h1 style={{color: "gray", marginTop: "20px"}}>Мои конференции</h1>
      
    </div>
    <MyConference />
    <div style={{width: "60%", margin: "auto", marginTop: "40px", textAlign: "center" }} className={styles.classes} id="cb" >
      <h1 style={{color: "gray"}}>Смотреть конференции</h1>
      
    </div>
    <AllConferences />
      {showModal && (
        <div className={styles.classes_create_class_box} ref={menuRef} style={{textAlign: "center"}}>
          
            
            <DefaultInput title={"Предмет"} type={"text"} onChange={(e) => setTitle(e.target.value)} value={title}></DefaultInput>
            {/* <input
              type="text"
              placeholder="Предмет"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            /> */}
            {/* <OpacitedButton onClick={handleCloseModal} title={"Закрыть"}></OpacitedButton> */}

          

          <DefaultInput title={"Описание"} type={"text"} onChange={(e) => setDescription(e.target.value)} value={description}></DefaultInput>
            {/* <input
              type="text"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}
          <div style={{display: "flex", width: "70%", margin: "auto"}}>
            <input className={styles.classes_create_date}
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <div style={{marginLeft: "15px", marginTop: "20px"}}>

              <PurpleButton onClick={handleSubmit} title={"Отправить"}></PurpleButton>
            </div>
            
            
          </div>
          <p style={{fontSize: '80%', color: '#7950F2', marginTop: "15px"}}>Создание лекции стоит 50 коинов</p>
            
          
        </div>
      )}
    </>
    
    
  );
};

export default Schedule;
