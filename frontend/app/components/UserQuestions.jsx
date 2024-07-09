import React, { useEffect, useState } from "react";
import AddAnswer from "./AddAnswer";
import styles from "./styles/QuestionPreview.module.css"
import OpacitedButton from "./ui/opacitedButton"
import { fetchWithAuth } from "../utils/api";



const UserQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchWithAuth('https://bizkit.fun/api/v1/question/my', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        const data = await response.json();
        if (Array.isArray(data.body)) {
          setQuestions(data.body);
          console.log(data.body);
        } else {
          console.error("Data is not an array:", data.body);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchQuestions();
  }, []);

  const answerClick = (question) => {
    setSelectedQuestion(question);
  };


  return (
    <>
      {selectedQuestion ? (
        <AddAnswer question={selectedQuestion} />
      ) : (
        <div>
          {questions.map((question) => (
            <div className={styles.question_preview_box} key={question.uuid}>
                <div className={styles.question_preview_user_box}>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s" alt="" className={styles.question_preview_avatar}/>
                  <p className={styles.question_preview_nickname}>{"Aboba"}</p>
                  <hr className={styles.question_preview_hr} />
                  <p className={styles.question_preview_rank}>{"Megabrain"}</p>    
                </div>
                <div className={styles.question_preview_question_type}>
                  #{question.subject}
                </div>
                <div className={styles.question_preview_title}>
                  {question.header}
                </div>
                <div className={styles.question_preview_bottombar}>
                  <div className={styles.question_preview_cost}>
                    {question.reward}
                    <img src="biscuit.png" className={styles.question_preview_cookie} alt="" />
                  </div>
                  <div className={styles.question_preview_answer_button_wrapper}>
                    <OpacitedButton onClick={() => answerClick(question.uuid)} title={"Смотреть"}></OpacitedButton>
                  </div>  
                </div>
            </div>
            
          ))}
        </div>
      )}
    </>
  );
};

export default UserQuestions;