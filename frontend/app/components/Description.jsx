import React, { useState } from "react";
import styles from "./styles/Description.module.css"

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
      <p style={{color: '#7950F2', textAlign: 'center', margin: '0 auto', fontSize:'150%', padding:'1rem', fontWeight:'bold' }}>Частозадаваемые вопросы</p>
        <div style={{display: "flex", flexDirection: "column"}}>
          <div style={{display: "flex",  alignItems: "center", cursor: "pointer", paddingBottom:'2vh'}} onClick={toggleFirstAnswer}>
            <div className={`${styles.triangle} ${showFirstAnswer ? styles.rotate : ''}`}>&#9650;</div>
            <p style={{color: '#7950F2', fontSize:'120%', fontWeight:'bold'}}>Для кого был создан проект?</p>
          </div>
          {showFirstAnswer && (
            <div style={{display: "flex",marginLeft:'1rem', alignItems: "center", cursor: "pointer"}}>
              <div className={`${styles.vertical_bar} ${showFirstAnswer ? styles.active : ''}`}></div>
              <p>Для любого человека, имеющего вопросы в сфере образования или желание поделиться собственным опытом. Кроме того проект подойдет людям, ищущим единомышленников в сфере образования</p>
            </div>
          )}
          <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={toggleSecondAnswer}>
            <div className={`${styles.triangle} ${showSecondAnswer ? styles.rotate : ''}`}>&#9650;</div>
           
            <p>Question 2?</p>
          </div>
          {showSecondAnswer && (
            <div style={{display: "flex", alignItems: "center", cursor: "pointer"}}>
              <div className={`${styles.vertical_bar} ${showSecondAnswer ? styles.active : ''}`}></div>
              <p>Answer 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Description;