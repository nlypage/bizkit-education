import React, { useState } from "react";
import styles from "./styles/Description.module.css";

const Description = () => {
  const [showFirstAnswer, setShowFirstAnswer] = useState(false);
  const [showSecondAnswer, setShowSecondAnswer] = useState(false);
  const [showThirdAnswer, setShowThirdAnswer] = useState(false);
  const [showForthAnswer, setShowForthAnswer] = useState(false);
  const [showFifthAnswer, setShowFifthAnswer] = useState(false);

  const toggleFirstAnswer = () => {
    setShowFirstAnswer(!showFirstAnswer);
  };

  const toggleSecondAnswer = () => {
    setShowSecondAnswer(!showSecondAnswer);
  };

  const toggleThirdAnswer = () => {
    setShowThirdAnswer(!showThirdAnswer);
  };

  const toggleForthAnswer = () => {
    setShowForthAnswer(!showForthAnswer);
  };

  const toggleFifthAnswer = () => {
    setShowFifthAnswer(!showFifthAnswer);
  };

  return (
    <div className={styles.description_box}>
      <div>
        <p
          style={{
            color: "#7950F2",
            textAlign: "center",
            margin: "0 auto",
            fontSize: "150%",
            padding: "1rem",
            fontWeight: "bold",
          }}
        >
          Частозадаваемые вопросы
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingBottom: "2vh",
            }}
            onClick={toggleFirstAnswer}
          >
            <div
              className={`${styles.triangle} ${
                showFirstAnswer ? styles.rotate : ""
              }`}
            >
              &#9650;
            </div>
            <p
              style={{ color: "#7950F2", fontSize: "120%", fontWeight: "bold" }}
            >
              Для кого был создан проект?
            </p>
          </div>
          {showFirstAnswer && (
            <div
              style={{
                display: "flex",
                marginLeft: "1rem",
                alignItems: "center",
                cursor: "pointer",
                paddingBottom: "2vh",
              }}
            >
              <div
                className={`${styles.vertical_bar} ${
                  showFirstAnswer ? styles.active : ""
                }`}
              ></div>
              <p>
                Для любого человека, имеющего вопросы в сфере образования или
                желание поделиться собственным опытом. Кроме того проект
                подойдет людям, ищущим единомышленников в сфере образования
              </p>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingBottom: "2vh",
            }}
            onClick={toggleSecondAnswer}
          >
            <div
              className={`${styles.triangle} ${
                showSecondAnswer ? styles.rotate : ""
              }`}
            >
              &#9650;
            </div>

            <p
              style={{ color: "#7950F2", fontSize: "120%", fontWeight: "bold" }}
            >
              Зачем нужна комиссия?
            </p>
          </div>
          {showSecondAnswer && (
            <div
              style={{
                display: "flex",
                marginLeft: "1rem",
                alignItems: "center",
                cursor: "pointer",
                paddingBottom: "2vh",
              }}
            >
              <div
                className={`${styles.vertical_bar} ${
                  showSecondAnswer ? styles.active : ""
                }`}
              ></div>
              <p>
                С помощью оплаты комиссии мы получаем ресурсы для развития
                проекта, кроме того, так мы минимизируем желание пользователей
                перегонять баллы между собой
              </p>
            </div>
          )}






<div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingBottom: "2vh",
            }}
            onClick={toggleThirdAnswer}
          >
            <div
              className={`${styles.triangle} ${
                showThirdAnswer ? styles.rotate : ""
              }`}
            >
              &#9650;
            </div>
            <p
              style={{ color: "#7950F2", fontSize: "120%", fontWeight: "bold" }}
            >
              Зачем ходить на очные встречи?
            </p>
          </div>
          {showThirdAnswer && (
            <div
              style={{
                display: "flex",
                marginLeft: "1rem",
                alignItems: "center",
                cursor: "pointer",
                paddingBottom: "2vh",
              }}
            >
              <div
                className={`${styles.vertical_bar} ${
                  showThirdAnswer ? styles.active : ""
                }`}
              ></div>
              <p>
                Это уникальная возможность обменяться опытом с единомышленниками, а также познакомиться с новыми людьми, однако посещение мероприятий исключительно добровольное
              </p>
            </div>
          )}

<div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingBottom: "2vh",
            }}
            onClick={toggleForthAnswer}
          >
            <div
              className={`${styles.triangle} ${
                showForthAnswer ? styles.rotate : ""
              }`}
            >
              &#9650;
            </div>
            <p
              style={{ color: "#7950F2", fontSize: "120%", fontWeight: "bold" }}
            >
              Проект останется бесплатным?
            </p>
          </div>
          {showForthAnswer && (
            <div
              style={{
                display: "flex",
                marginLeft: "1rem",
                alignItems: "center",
                cursor: "pointer",
                paddingBottom: "2vh",
              }}
            >
              <div
                className={`${styles.vertical_bar} ${
                  showForthAnswer ? styles.active : ""
                }`}
              ></div>
              <p>
                Все заявленные сейчас функции останутся бесплатными, некоторые новые будут только за дополнительную плату
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Description;
