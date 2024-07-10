import React, { useState, useEffect } from 'react'
import { fetchWithAuth } from '../utils/api';

const Conference = ({ conference }) => {
  const [inputValue, setInputValue] = useState();
  const [conferenceData, setConferenceData] = useState(conference);

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
            url: conferenceData.url,
          }),
        }
      );

      const responseData = await response.json();
      console.log("Response:", responseData);
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



  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    console.log("Input value:", e.target.value);
  };

  return (
    <>
      <div>{conferenceData.title}</div>
      <div>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${conferenceData.url.split('/').pop()}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <button onClick={handleSubmit}>Получить краткое содержание</button>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={Donate}>Отправить донат</button>
    </>
  )
}

export default Conference