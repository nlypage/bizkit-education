import React, { useEffect, useState } from "react";

import styles from "../styles/QuestionPreview.module.css";
import OpacitedButton from "../ui/opacitedButton";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";


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
      } else {
        console.error("PATCH request failed");
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
    } catch (error) {
      console.error(error);
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
      <div>
        {myConference.map((conference) => (
          <div className={styles.question_preview_box} key={conference.uuid}>
            <div className={styles.question_preview_user_box}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s"
                alt=""
                className={styles.question_preview_avatar}
              />
              <p className={styles.question_preview_nickname}>{"Aboba"}</p>
              <hr className={styles.question_preview_hr} />
              <p className={styles.question_preview_rank}>{"Megabrain"}</p>
            </div>
            <div className={styles.question_preview_title}>
              {conference.title}
            </div>
            <div className={styles.question_preview_bottombar}>
              <div className={styles.question_preview_cost}>
                {conference.description}
                <img
                  src="biscuit.png"
                  className={styles.question_preview_cookie}
                  alt=""
                />
              </div>
              <div className={styles.question_preview_answer_button_wrapper}>
                <OpacitedButton
                     onClick={() => addLink(conference)}
                  title={"Добавить ссылку"}
                ></OpacitedButton>
              </div>
              <div className={styles.question_preview_answer_button_wrapper}>
                <OpacitedButton
                  onClick={() => joinConference(conference)}
                  title={"Начать лекцию"}
                ></OpacitedButton>
              </div>
              <div className={styles.question_preview_answer_button_wrapper}>
                <OpacitedButton
                  onClick={() => handlePatchRequest(conference)}
                  title={"Отметить завершенной"}
                ></OpacitedButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div onClose={() => setShowModal(false)}>
          <div>
            <h3>Добавить ссылку</h3>
            <input
              type="text"
              value={linkToAdd}
              onChange={(e) => setLinkToAdd(e.target.value)}
            />
            <button onClick={handleLinkSubmit}>Сохранить</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyConference;
