import React, { useEffect, useState } from "react";

import styles from "../styles/QuestionPreview.module.css";
import OpacitedButton from "../ui/opacitedButton";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";
import scheduleStyles from "../styles/Schedule.module.css"
import DefaultInput from "../ui/defaultInput";
import PurpleButton from "../ui/purpleButton";

const MyConference = () => {
  const [myConference, setMyConference] = useState([]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [linkToAdd, setLinkToAdd] = useState("");
  const [selectedConference, setSelectedConference] = useState(null);

  const joinConference = (conference) => {
    router.push(`/room/${conference.uuid}`);
  };

  const addLink = (conference) => {
    setSelectedConference(conference);
    setShowModal(true);
  };
  const handlePatchRequest = async (conference) => {
    try {
      const response = await fetchWithAuth(
        `https://bizkit.fun/api/v1/conference/${conference.uuid}/archive`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("PATCH request successful");
        router.push("/");
        Toastify({
          text: 'Лекция архивировала',
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
        console.error("PATCH request failed");
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
      console.error(error);
    }
  };

  const handleLinkSubmit = async () => {
    try {
      await fetchWithAuth(`https://bizkit.fun/api/v1/conference/url`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ url: linkToAdd, uuid: selectedConference.uuid}),
      });
      console.log(JSON.stringify({ url: linkToAdd, uuid: selectedConference.uuid}))
      setShowModal(false);
      setLinkToAdd("");
      Toastify({
        text: 'Ссылка добалвена',
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
    } catch (error) {
      console.error(error);
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
  };

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetchWithAuth(
          "https://bizkit.fun/api/v1/conference/my",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await response.json();
        if (Array.isArray(data.body)) {
          setMyConference(data.body);
          console.log(data.body);
        } else {
          console.error("Data is not an array:", data.body);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchConferences();
  }, []);

  return (
    <>
      
    {myConference.map((conference) => (
          <div className={styles.question_preview_box} key={conference.uuid} style={{minWidth: "370px", maxWidth: "1000px", marginTop: "30px"}}>
            <div className={styles.question_preview_user_box}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s"
                alt=""
                className={styles.question_preview_avatar}
              />
              <p className={styles.question_preview_nickname}>{conference?.author?.username}</p>
              <hr className={styles.question_preview_hr} />
              <p className={styles.question_preview_rank}>{conference?.author?.rate}</p>
            </div>
            <div className={styles.question_preview_title}>
              {conference.title}
            </div>
            <div className={styles.question_preview_bottombar}>
              
              <div className={styles.question_preview_answer_button_wrapper} style={{marginLeft: "10px", marginRight: "0px"}}>
                <OpacitedButton
                     onClick={() => addLink(conference)}
                  title={"Ссылка"}
                ></OpacitedButton>
              </div>
              <div className={styles.question_preview_answer_button_wrapper} style={{marginLeft: "100px", marginRight: "0px"}}>
                <OpacitedButton
                  onClick={() => joinConference(conference)}
                  title={"Начать"}
                ></OpacitedButton>
              </div>
              <div className={styles.question_preview_answer_button_wrapper} style={{float: "left", marginLeft: "100px",marginRight: "0px"}}>
                <OpacitedButton
                  onClick={() => handlePatchRequest(conference)}
                  title={"Отменить"}
                ></OpacitedButton>
              </div>
            </div>
          </div>
        ))} 
      
      {showModal && (
        <div onClose={() => setShowModal(false)}>
          <div className={scheduleStyles.classes_create_class_box} style={{textAlign: "center"}}>
            <DefaultInput title={"Ссылка"}type={"text"} value={linkToAdd} onChange={(e) => setLinkToAdd(e.target.value)}></DefaultInput>
            {/* <input
              type="text"
              value={linkToAdd}
              onChange={(e) => setLinkToAdd(e.target.value)}
            /> */}
            <div style={{marginTop: "20px"}}>
              <PurpleButton onClick={handleLinkSubmit} title={"Сохранить"}></PurpleButton>
            </div>
            
            
          </div>
        </div>
      )}
      <br />
    </>
  );
};

export default MyConference;
