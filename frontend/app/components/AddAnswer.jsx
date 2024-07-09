'use client'

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";

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
    <div>
      <div>Предмет: {data ? data.subject : "Loading..."}</div>
      <div>Описание {data ? data.body : "Loading..."}</div>
      <div>
        {data
          ? data?.answers?.map((answer) => (
              <div key={answer.uuid}>
                <div>{answer?.body}</div>
                <button onClick={() => markAsCorrect(answer.uuid)}>
                  Правильный ответ
                </button>
              </div>
            ))
          : "Еще нет ответов"}
      </div>
      <button onClick={() => setShowAnswerInput(!showAnswerInput)}>
        Ответить
      </button>
      {showAnswerInput && (
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={addAnswer}>Отправить</button>
        </div>
      )}
    </div>
  );
};

export default AddAnswer;
