"use client";

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";
import styles from "./styles/AddAnswer.module.css";
import answerQuestionStyles from "./styles/QuestionPreview.module.css";
import OpacitedButton from "./ui/opacitedButton";
import addQuestionStyles from "./styles/AddQuestion.module.css";
import PurpleButton from "./ui/purpleButton";
// {
//   "uuid": "f413611a-198c-428a-b2c5-08f22595d5f3",
//   "created_at": "2024-07-04T20:20:06.478291Z",
//   "updated_at": "2024-07-04T20:20:06.478291Z",
//   "author_uuid": "dc5edb8d-d889-4d96-8598-75e361066b6e",
//   "header": "Текст",
//   "body": "альтернативный текст",
//   "subject": "Русский язык",
//   "reward": 20,
//   "closed": false,
//   "answers": [
//       {
//           "uuid": "f1aa6a74-4fe9-4165-a2a5-bccacc476f8a",
//           "created_at": "2024-07-04T20:24:48.354046Z",
//           "updated_at": "2024-07-04T20:24:48.354046Z",
//           "author_uuid": "dc5edb8d-d889-4d96-8598-75e361066b6e",
//           "question_uuid": "f413611a-198c-428a-b2c5-08f22595d5f3",
//           "body": "какой то текст",
//           "is_correct": false
//       }
//   ]
// }

const AddAnswer = ({ question }) => {
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `https://bizkit.fun/api/v1/question/${question}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data = await response.json();
      setData(data.body);
      console.log(data.body);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [question]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth(
          `https://bizkit.fun/api/v1/user/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUser(data.body);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const markAsCorrect = async (correct) => {
    try {
      const response = await fetchWithAuth(
        `https://bizkit.fun/api/v1/question/answer/correct/${correct}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addAnswer = async () => {
    try {
      const response = await fetchWithAuth(
        "https://bizkit.fun/api/v1/question/answer/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_uuid: question,
            body: answer,
          }),
        }
      );

      if (response.ok) {
        console.log(answer);
        setShowAnswerInput(!showAnswerInput);
        fetchQuestions();
      } else {
        console.error("Error submitting question");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      {/* исправить именя пользователя, проблема бека */}
      <div className={styles.question_box}>
        <div className={answerQuestionStyles.question_preview_user_box}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s"
            alt=""
            className={answerQuestionStyles.question_preview_avatar}
          />
          <p className={answerQuestionStyles.question_preview_nickname}>
            {data?.question.author?.username}
          </p>
          <hr
            className={answerQuestionStyles.question_preview_hr}
            style={{ marginLeft: "0px" }}
          />
          <p className={answerQuestionStyles.question_preview_rank}>
            {data?.question.author?.rate}
          </p>
          
          
          <div
            className={answerQuestionStyles.question_preview_cost}
            style={{
              marginTop: "17px",
              margin: "auto",
              float: "right",
              marginRight: "00px",
            }}
          >
            {data?.question.reward}
            <img
              src="biscuit.png"
              className={answerQuestionStyles.question_preview_cookie}
              alt=""
            />
          </div>
        </div>
        <div
            className={answerQuestionStyles.question_preview_question_type}
            style={{ marginTop: "20px", marginLeft: "20px" }}
          >
            #{data?.question.subject}
          </div>
        <div className={styles.question_title} style={{marginTop: "10px"}}>
          {data ? data.question.header : "Loading..."}
        </div>
        <div className={styles.question_description}>
          {data ? data.question.body : "Loading..."}
        </div>
        <div className={styles.question_bottombar}>
          <div className={styles.question_bottombar_info}>
            Вопрос{" "}
            {data?.question.closed == false ? (
              <span
                style={{
                  color: "#7950F2",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {" "}
                открыт
              </span>
            ) : (
              <span
                style={{
                  color: "#7950F2",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {" "}
                закрыт
              </span>
            )}
            <hr
              className={answerQuestionStyles.question_preview_hr}
              style={{ marginLeft: "0px", marginTop: "10px" }}
            />
            <span style={{ color: "#7950F2", fontWeight: "bold" }}>
              {data?.answers?.length || 0}
            </span>
            <span style={{ marginLeft: "5px" }}>ответов</span>
          </div>

          <div
            className={styles.question_preview_answer_button_wrapper}
            style={{
              marginTop: "-30px",
              margin: "auto",
              marginRight: "10px",
              float: "right",
            }}
          >
            {data?.question?.closed == false ? (
              <OpacitedButton
                onClick={() => setShowAnswerInput(!showAnswerInput)}
                title={"Ответить"}
              ></OpacitedButton>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>

      {showAnswerInput && (
        <div className={styles.question_answer_box}>
          <textarea
            className={addQuestionStyles.add_question_description}
            style={{ height: "300px", width: "97%", marginLeft: "1.5%" }}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
           <p style={{fontSize: '80%', color: '#7950F2', marginLeft: '1vw'}}>Комиссия сервиса составляет 20%</p>
          <div
            className={styles.question_preview_answer_button_wrapper}
            style={{
              margin: "auto",
              marginTop: "10px",
              marginRight: "10px",
              float: "right",
            }}
          >
           
            <OpacitedButton
              onClick={addAnswer}
              title={"Отправить"}
            ></OpacitedButton>
          </div>
        </div>
      )}

      <div className={styles.question_answer_p}>Ответы:</div>

      <div>
        {data?.answers?.length > 0 ? (
          data?.answers?.map((answer) => (
            <div
              className={answerQuestionStyles.question_preview_box}
              key={answer.uuid}
              style={{ marginTop: "30px" }}
            >
              <div className={answerQuestionStyles.question_preview_user_box}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s"
                  alt=""
                  className={answerQuestionStyles.question_preview_avatar}
                />
                <p className={answerQuestionStyles.question_preview_nickname}>
                  {answer.author.username}
                </p>
                <hr className={answerQuestionStyles.question_preview_hr} />
                <p className={answerQuestionStyles.question_preview_rank}>
                  {answer.author.rate}
                </p>

                {user?.uuid == data?.author_uuid && data.closed == false ? (
                  <div
                    style={{
                      margin: "auto",
                      marginTop: "10px",
                      marginRight: "10px",
                      float: "right",
                    }}
                  >
                    <PurpleButton
                      title={"Отметить верным"}
                      onClick={() => markAsCorrect(answer.uuid)}
                    ></PurpleButton>
                  </div>
                ) : data.question.closed == true &&
                  answer.is_correct == true ? (
                  <div
                    style={{
                      margin: "auto",
                      marginTop: "10px",
                      marginRight: "10px",
                      float: "right",
                      color: "#7950F2",
                      fontWeight: "bold",
                    }}
                  >
                    правильный ответ
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div
                className={styles.question_description}
                style={{ marginTop: "20px" }}
              >
                {answer.body}
              </div>
              {/* ДОЛЖНА БЫТЬ КНОПКА ЗАКРЫТИЯ ВОПРОСА ЕСЛИ ЭТО ВОПРОС ОТ ПОЛЬЗОВАТЕЛЯ */}
              {/* <div className={answerQuestionStyles.question_preview_bottombar}>
                          
                          <div className={answerQuestionStyles.question_preview_answer_button_wrapper}>
                            <OpacitedButton title={"Пометить как верный"}></OpacitedButton>
                          </div>  
                        </div> */}
            </div>
          ))
        ) : (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              fontSize: "2vh",
            }}
          >
          </div>
        )}
      </div>
      <br />
    <br />
    <br />
    <br />
    <br />
    </>
  );
};

export default AddAnswer;
