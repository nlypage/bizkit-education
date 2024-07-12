import React, { useEffect, useState } from "react";
import AddAnswer from "./AddAnswer";
import styles from "./styles/QuestionPreview.module.css";
import OpacitedButton from "./ui/opacitedButton";
import PurpleButton from "./ui/purpleButton";

const AnswerQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const url = `https://bizkit.fun/api/v1/question/all?limit=10&offset=${offset}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        const data = await response.json();
        if (Array.isArray(data.body)) {
          setQuestions(data.body);
          setHasMoreQuestions(data.body.length === 10);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [offset]);

  const answerClick = (question) => {
    setSelectedQuestion(question);
  };

  const loadMore = () => {
    setOffset((prevOffset) => prevOffset + 10);
  };

  const loadPrevios = () => {
    setOffset((prevOffset) => prevOffset - 10);
  };
  return (
    <>
      {selectedQuestion ? (
        <AddAnswer question={selectedQuestion} />
      ) : (
        <div>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div className={styles.question_preview_box} key={question.uuid}>
                <div className={styles.question_preview_user_box}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s"
                    alt=""
                    className={styles.question_preview_avatar}
                  />
                  <p className={styles.question_preview_nickname}>
                    {question.author.username}
                  </p>
                  <hr className={styles.question_preview_hr} />
                  <p className={styles.question_preview_rank}>
                    {question.author.rate}
                  </p>
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
                    <img
                      src="biscuit.png"
                      className={styles.question_preview_cookie}
                      alt=""
                    />
                  </div>
                  <div
                    className={styles.question_preview_answer_button_wrapper}
                  >
                    <OpacitedButton
                      onClick={() => answerClick(question.uuid)}
                      title={"Ответить"}
                    ></OpacitedButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div  style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              fontSize: '3vh'
            }}><p>Добавьте первый вопрос</p></div>
          )}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className={styles.question_preview_pagination_buttons}>
              <OpacitedButton
                onClick={loadPrevios}
                title={"Назад"}
              ></OpacitedButton>
              <div className={styles.question_preview_padding_div}></div>
              <PurpleButton onClick={loadMore} title={"Далее"}></PurpleButton>
            </div>
          )}

          {/* :) бр бр бр))*/}
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      )}
    </>
  );
};

export default AnswerQuestions;
