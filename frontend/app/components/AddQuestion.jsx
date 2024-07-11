import React, { useState } from "react";
import { fetchWithAuth } from "../utils/api";
import styles from "./styles/AddQuestion.module.css"
import PurpleButton from "./ui/purpleButton";
import stylesForInput from "./styles/DefaultInput.module.css"

const AddQuestion = ({ setView }) => {
  const [subject, setSubject] = useState("");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [reward, setReward] = useState(20);

  const handleSubmit = async () => {
    try {
      const response = await fetchWithAuth(
        "https://bizkit.fun/api/v1/question/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: subject,
            body: body,
            reward: reward,
            header: header,
          }),
        }
      );

      const responseData = await response.json();
      console.log("Response:", responseData);

      if (response.ok) {
        setView("userquestion");
      } else {
        console.error("Error submitting question");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <div className={styles.add_question_box}>
        <div style={{display: "flex", width: "100%"}}>
          <div className={stylesForInput.input_box} style={{maxWidth: "500px", marginTop: "10px", marginLeft: "2%"}}>
            <p className={stylesForInput.input_title}>Вопрос</p>
            <input value={header} onChange={(e) => setHeader(e.target.value)} className={stylesForInput.input} type="text" />
            <div style={{fontSize: '80%', color: '#7950F2'}}>{header.length <= 5 && header.length > 0 ? (<div>Недостаточно символов</div>): (<div></div>)}</div>

          </div>
          
          <div className={styles.ask_question_reward_box} style={{width: "150px", marginRight: "2%", marginTop: "27px"}}>
            <select
              name="subject"
              id="object"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.add_question_reward_dropdown }
              style={{fontWeight: "normal", color: "black", fontSize: "18px", marginTop: "-3px"}}
            >
              <option value="Другое">Другое</option>
              <option value="Математика">Математика</option>
              <option value="Русский язык">Русский язык</option>
            </select>
          </div>
        </div>
        
        <div className={styles.add_question_description_wrapper}>
          <textarea placeholder="Напишите подробнее о вопросе" className={styles.add_question_description} value={body} onChange={(e) => setBody(e.target.value)} />
          <div style={{fontSize: '80%', color: '#7950F2'}}>{body.length <= 20 && body.length > 0? (<div>Недостаточно символов</div>): (<div></div>)}</div>
        </div>
        
        
        <div className={styles.ask_question_button_box}>
          <div className={styles.ask_question_reward_box} style={{marginLeft: "2%"}}>
            <p style={{marginLeft: "5px", marginTop: "10px"}}>Награда</p>
            <img src="https://img.icons8.com/?size=100&id=99885&format=png&color=7950F2" style={{marginLeft: "5px", marginTop: "15px"}} width={"15"} height={"15"} alt="" />
            <img src="biscuit.png" className={styles.add_question_reward_cookie} alt="" />
            <select
              name="reward"
              id="reward"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              className={styles.add_question_reward_dropdown}
            >
              {Array.from({ length: 81 }, (_, i) => i + 20).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            
          </div>
          <div style={{marginLeft: "auto", marginRight: "2%"}}>
              
            <PurpleButton onClick={handleSubmit} title={"Задать вопрос"}></PurpleButton>
        
          </div>
        </div>
      </div>
      <br />
    <br />
    <br />
    <br />
    <br />
    </>
  );
};

export default AddQuestion;
