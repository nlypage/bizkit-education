"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/QuestionPreview.module.css";
import OpacitedButton from "../ui/opacitedButton";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";
import Conference from "../Conference";

const AllConferences = ({setView}) => {
  const [conf, setConf] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);
  const router = useRouter();

  const fetchConference = async (searchType) => {
    try {
      const response = await fetchWithAuth(
        `https://bizkit.fun/api/v1/conference/all?search_type=${searchType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setConf(data.body);
    } catch (error) {
      console.error(error);
    }
  };

  const viewConference = (conference) => {
    setSelectedConference(conference);
  };

  useEffect(() => {
    fetchConference(isArchived ? "archived" : "upcoming");
  }, [isArchived]);

  const joinConference = (conference) => {
    window.location.href = `/room/${conference.uuid}?roomID=${conference.uuid}&role=Audience`;
  };

  return (

    <>
    {selectedConference ? (<Conference conference={selectedConference}/>):(
    <div>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${isArchived ? styles.activeButton : ""}`}
          onClick={() => setIsArchived(true)}
        >
          Архивные
        </button>
        <button
          className={`${styles.button} ${!isArchived ? styles.activeButton : ""}`}
          onClick={() => setIsArchived(false)}
        >
          Предстоящие
        </button>
      </div>
      {conf ? (
        <div>
          {conf.map((conference) => (
            <div
              className={styles.question_preview_box}
              key={conference.uuid}
              onClick={() => viewConference(conference)}
            >
              <div className={styles.question_preview_title}>
                {conference.title}
              </div>
              <div className={styles.question_preview_bottombar}>
                <div className={styles.question_preview_answer_button_wrapper}>
                  <OpacitedButton
                    onClick={() => (isArchived ? viewConference(conference) : joinConference(conference))}
                    title={isArchived ? "Посмотреть" : "Открыть лекцию"}
                  ></OpacitedButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>К сожаление подходящих конференций нет</div>
      )}
    </div>)}
    </>
  );
};

export default AllConferences;