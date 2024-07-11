import React, { useState, useEffect } from 'react'
import { fetchWithAuth } from '../utils/api';
import DefaultInput from './ui/defaultInput';
import PurpleButton from './ui/purpleButton';
import OpacitedButton from './ui/opacitedButton';

const Conference = ({ conference }) => {
  const [inputValue, setInputValue] = useState();
  const [conferenceData, setConferenceData] = useState(conference);
  const [summa, setSumma] = useState()


  const handleSubmit = async () => {
    try {
      const response = await fetchWithAuth(
        "https://bizkit.fun/summarize/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: conferenceData.url,
          }),
        }
      );
      const responseData = await response.json();
      console.log("Response:", responseData);
      document.getElementById('summary-container').innerHTML = responseData.content;
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const Donate = async () => {
    try {
      const response = await fetchWithAuth(
        `https://bizkit.fun/api/v1/conference/${conference.uuid}/donate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseInt(inputValue),
          }),
        }
      );

      const responseData = await response.json();
      console.log("Response:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(summa)

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    console.log("Input value:", e.target.value);
  };

  return (
    <>
      <div style={{
        width: "300px",
        margin: "auto",
        marginTop: "30px"
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "22px",
          fontWeight: "bold",
          color: "grey"
        }}>{conferenceData.title}</div>
        <div>
          <iframe
            width="300"
            height="215"
            style={{
              borderStyle: "none",
              borderRadius: "16px"
            }}
            src={`https://www.youtube.com/embed/${conferenceData.url.split('/').pop()}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div id='summary-container'></div>
        <div style={{marginTop: "20px", marginLeft: "40px"}}>
          <OpacitedButton title={"Краткое содержание"} onClick={handleSubmit}></OpacitedButton>

        </div>
        <div  style={{marginTop: "-20px"}}>
          <DefaultInput title={"Сумма"} type={"text"} value={inputValue} onChange={handleInputChange}></DefaultInput>

        </div>
        <div style={{marginTop: "20px", marginLeft: "40px"}}>
          <PurpleButton title={"Задонатить"} onClick={Donate}></PurpleButton>
        </div>
      </div>
      
    </>
  )
}

export default Conference