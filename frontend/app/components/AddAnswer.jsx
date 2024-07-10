'use client'

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";
import styles from './styles/AddAnswer.module.css'
import answerQuestionStyles from './styles/QuestionPreview.module.css'
import OpacitedButton from "./ui/opacitedButton";
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [question]);

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
      <div className={styles.question_box}>
        <div className={answerQuestionStyles.question_preview_user_box}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s" alt="" className={answerQuestionStyles.question_preview_avatar}/>
          <p className={answerQuestionStyles.question_preview_nickname}>{"Abob"}</p>
          <hr className={answerQuestionStyles.question_preview_hr} style={{marginLeft:"0px"}}/>
          <p className={answerQuestionStyles.question_preview_rank}>{"Megabrain"}</p>    
          <hr className={answerQuestionStyles.question_preview_hr} style={{marginLeft:"0px"}}/>
          <div className={answerQuestionStyles.question_preview_question_type} style={{marginTop: "20px", marginLeft:"0px"}}>

            #Физика
          </div>
          <div className={answerQuestionStyles.question_preview_cost}  style={{marginTop: "17px", margin: "auto", float: "right", marginRight: "00px"}}>
            150
            <img src="biscuit.png" className={answerQuestionStyles.question_preview_cookie} alt="" />
          </div>
        </div>

        <div className={styles.question_title}>{data ? data.subject : "Loading..."}</div>
        <div className={styles.question_description}>{data ? data.body : "Loading..."}</div>
        <div className={styles.question_bottombar}>
          <div className={styles.question_bottombar_info}>
            Вопрос <span style={{color: "#7950F2", fontWeight: "bold", marginLeft: "5px"}}> открыт</span>
            <hr className={answerQuestionStyles.question_preview_hr} style={{marginLeft:"0px", marginTop: "10px"}}/>
            <span style={{color: "#7950F2", fontWeight: "bold"}}>12 </span> <span style={{marginLeft: "5px"}}>ответов</span>
          </div>
          
          <div className={styles.question_preview_answer_button_wrapper} style={{marginTop: "-30px",margin: "auto", marginRight: "10px", float: "right"}}>
            <OpacitedButton onClick={() => setShowAnswerInput(!showAnswerInput)} title={"Ответить"}></OpacitedButton>
          </div>

        </div>
      </div>

      {showAnswerInput && (
        <div className={styles.question_answer_box}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className={styles.question_preview_answer_button_wrapper} style={{marginTop: "20px",margin: "auto", marginRight: "10px", float: "right"}}>
            <OpacitedButton onClick={addAnswer} title={"Отправить"}></OpacitedButton>
          </div>
          
        </div>
      )}
      
      <div className={styles.question_answer_p}>
        Ответы:
      </div>

      {/* DIV для примера */}
      <div className={answerQuestionStyles.question_preview_box} key={answer.uuid} style={{marginTop: "30px"}}>
        <div className={answerQuestionStyles.question_preview_user_box}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s" alt="" className={answerQuestionStyles.question_preview_avatar}/>
                    <p className={answerQuestionStyles.question_preview_nickname}>{"Aboba"}</p>
                    <hr className={answerQuestionStyles.question_preview_hr} />
                    <p className={answerQuestionStyles.question_preview_rank}>{"Megabrain"}</p>    
                  </div>
                  <div className={styles.question_description} style={{marginTop: "20px"}}>
                    fnsjafhjahfjalkjk ?fmkl kml
                  </div>
                  {/* ДОЛЖНА БЫТЬ КНОПКА ЗАКРЫТИЯ ВОПРОСА ЕСЛИ ЭТО ВОПРОС ОТ ПОЛЬЗОВАТЕЛЯ */}
                  {/* <div className={answerQuestionStyles.question_preview_bottombar}>
                    
                    <div className={answerQuestionStyles.question_preview_answer_button_wrapper}>
                      <OpacitedButton title={"Пометить как верный"}></OpacitedButton>
                    </div>  
                  </div> */}
      </div>
      <div>
          {data
            ? data?.answers?.map((answer) => (
              <div className={answerQuestionStyles.question_preview_box} key={answer.uuid} style={{marginTop: "30px"}}>
                <div className={answerQuestionStyles.question_preview_user_box}>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s" alt="" className={answerQuestionStyles.question_preview_avatar}/>
                  <p className={answerQuestionStyles.question_preview_nickname}>{"Aboba"}</p>
                  <hr className={answerQuestionStyles.question_preview_hr} />
                  <p className={answerQuestionStyles.question_preview_rank}>{"Megabrain"}</p>    
                </div>
                <div className={styles.question_description} style={{marginTop: "20px"}}>
                  fnsjafhjahfjalkjk ?fmkl kml
                </div>
                        {/* ДОЛЖНА БЫТЬ КНОПКА ЗАКРЫТИЯ ВОПРОСА ЕСЛИ ЭТО ВОПРОС ОТ ПОЛЬЗОВАТЕЛЯ */}
                        {/* <div className={answerQuestionStyles.question_preview_bottombar}>
                          
                          <div className={answerQuestionStyles.question_preview_answer_button_wrapper}>
                            <OpacitedButton title={"Пометить как верный"}></OpacitedButton>
                          </div>  
                        </div> */}
              </div>
              ))
            : "Еще нет ответов"}
      </div>
      
      

      
        
    </>
  );
};

export default AddAnswer;
