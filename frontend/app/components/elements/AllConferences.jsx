"use client";

import React, { useEffect, useState } from "react";
// import questionPreviewStyles from "../questionPreviewStyles/QuestionPreview.module.css";
import OpacitedButton from "../ui/opacitedButton";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";
import Conference from "../Conference";
import styles from "../styles/Schedule.module.css"
import questionPreviewStyles from "../styles/QuestionPreview.module.css"

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
      <div className={questionPreviewStyles.buttonGroup} style={{display: "flex", width: "320px", padding: "1rem", margin: "auto",marginTop: "10px", }}  >
        <OpacitedButton title={"Архивные"} onClick={() => setIsArchived(true)} className={`${questionPreviewStyles.button} ${isArchived ? questionPreviewStyles.activeButton : ""}`}></OpacitedButton>
        <OpacitedButton title={"Предстоящие"} onClick={() => setIsArchived(false)} className={`${questionPreviewStyles.button} ${isArchived ? questionPreviewStyles.activeButton : ""}`}></OpacitedButton>
      </div>
      {conf ? (
        <div>
          {conf.map((conference) => (
            <div
              className={styles.all_classes_class_box}
              
              key={conference.uuid}
              onClick={() => viewConference(conference)}
            >
              <div className={questionPreviewStyles.question_preview_title}>
                {conference.title}
              </div>
              <div className={questionPreviewStyles.question_preview_title} style={{color: "grey", fontSize: "22px"}}>
                Самая ебейшая лекция по фронту на хаскеле
              </div>
              <div className={questionPreviewStyles.question_preview_title} style={{color: "grey", fontSize: "18px", fontWeight: "normal"}}>
                14:88 AM
              </div>
              <div className={questionPreviewStyles.question_preview_bottombar}>
                <div className={questionPreviewStyles.question_preview_answer_button_wrapper} style={{float: "left", marginRight: "0px", marginLeft: "10px"}}>
                  <OpacitedButton
                    onClick={() => (isArchived ? viewConference(conference) : joinConference(conference))}
                    title={isArchived ? "Посмотреть" : "Открыть"}
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
    <br />
    <br />
    <br />
    <br />
    <br />
    
    </>
  );
};

export default AllConferences;