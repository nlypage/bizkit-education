"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../utils/api";
import MyConference from "./elements/MyConference";
import AllConferences from "./elements/AllConferences";

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
    <div style={{ margin: "300px" }}>
      <button onClick={handleCreateConference}>Создать конференцию</button>
      <h1>Мои конференции</h1>
      <MyConference />
      <h1>Смотреть конференции</h1>
      <AllConferences />

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Создать конференцию</h2>
            <input
              type="text"
              placeholder="Предмет"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <button onClick={handleSubmit}>Отправить</button>
            <button onClick={handleCloseModal}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
