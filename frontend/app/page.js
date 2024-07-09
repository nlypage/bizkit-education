"use client";

import React, { useEffect, useState } from "react";
import Streaming from "./components/Streaming";
import AddQuestion from "./components/AddQuestion";
import AnswerQuestions from "./components/AnswerQuestions";
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import Description from "./components/Description";
import Shedule from "./components/Shedule";
import Profile from "./components/Profile";
import UserQuestions from "./components/UserQuestions";
import AddAnswer from "./components/AddAnswer";
import { withAuth } from "./middleware/auth";
import Header from "./components/base/Header";
import Conference from "./components/Conference";

const Home = () => {
  const [view, setView] = useState("answer");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <div>
          <Header></Header>
          <Sidebar view={view} setView={setView} />
          <div>
            {view === "answer" && <AnswerQuestions setView={setView} />}
            {view === "question" && <AddQuestion setView={setView} />}
            {view === "description" && <Description setView={setView} />}
            {view === "shedule" && <Shedule setView={setView} />}
            {view === "profile" && <Profile setView={setView} />}
            {view === "stream" && <Streaming setView={setView} />}
            {view === "userquestion" && <UserQuestions setView={setView} />}
            {view === "addanswer" && <AddAnswer setView={setView} />}
            {view === "card" && <Card setView={setView} />}
            {view === "conference" && <Conference setView={setView} />}
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Home);
