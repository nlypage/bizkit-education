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
        setConferences([data, ...conferences]);
        handleCloseModal();
      } else {
        console.error("Error submitting conference:", response.status);
      }
    } catch (error) {
      console.error("Error submitting conference:", error);
    }
  };


  return (
    <div style={{ margin: "300px" }} className={styles.classes} id="cb">
      <button onClick={handleCreateConference}>Создать конференцию</button>
      <h1>Мои конференции</h1>
      <MyConference />
      <h1>Смотреть конференции</h1>
      <AllConferences />

      {showModal && (
        <div className={styles.classes_create_class_box} ref={menuRef}>
          
            
            <DefaultInput title={"Предмет"} type={"text"} onChange={(e) => setTitle(e.target.value)} value={title}></DefaultInput>
            {/* <input
              type="text"
              placeholder="Предмет"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            /> */}
            {/* <OpacitedButton onClick={handleCloseModal} title={"Закрыть"}></OpacitedButton> */}

          

          <DefaultInput title={"Описание"} type={"text"} onChange={(e) => setDescription(e.target.value)} value={title}></DefaultInput>
            {/* <input
              type="text"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}
          <div style={{display: "flex", width: "10%", margin: "auto"}}>
            <input className={styles.classes_create_date}
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <div style={{marginLeft: "15px", marginTop: "20px"}}>

              <PurpleButton onClick={handleSubmit} title={"Отправить"}></PurpleButton>
            </div>

            
          </div>
            
            
          
        </div>
      )}
    </div>
  );
};

export default Schedule;
