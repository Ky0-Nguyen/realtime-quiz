"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type QuizType = {
  userName: string;
  score: string | number;
};

type HistoryType = {
  userName: string;
  score: string | number;
  answer: string;
  userId: string;
};

const Quiz = () => {
  const [quizId, setQuizId] = useState("");
  const [userName, setUserName] = useState("");
  const [leaderBoard, setLeaderBoard] = useState<QuizType[]>([]);
  const [histories, setHistories] = useState<HistoryType[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  const joinQuiz = () => {
    if (quizId && userName) {
      socket.emit("joinQuiz", { quizId, userName });
      setIsJoined(true);
    }
  };

  useEffect(() => {
    socket.on("leaderBoardUpdate", (data) => {
      setLeaderBoard(data);
    });

    socket.on("historyUpdate", (data) => {
      console.log("data", data);
      setHistories(data.reverse());
    });

    return () => {
      socket.off("leaderBoardUpdate");
      socket.off("historyUpdate");
    };
  }, []);
  const submitAnswer = () => {
    const answer = Math.random() > 0.5 ? "correct" : "incorrect";
    console.log("data", answer);
    socket.emit("submitAnswer", { quizId, answer });
  };
  console.log("leaderBoard", leaderBoard);
  return (
    <div className="quiz-container">
      {!isJoined ? (
        <div className="join-quiz">
          <input
            className="quiz-input"
            type="text"
            placeholder="Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <input
            className="quiz-input"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className="join-button" onClick={joinQuiz}>
            Join Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-details">
          <h2>Quiz ID: {quizId}</h2>
          <h3>Leaderboard</h3>
          <ul className="leaderboard">
            {leaderBoard.map((entry, index) => (
              <li key={index} className="leaderboard-entry">
                {entry.userName}: {entry.score} points
              </li>
            ))}
          </ul>
          <button className="submit-button" onClick={submitAnswer}>
            Submit Answer
          </button>

          <h3>History</h3>
          <ul className="leaderboard">
            {histories.map((entry, index) => (
              <li key={index} className="leaderboard-entry">
                {entry.userName} ({entry.userId}): {entry.answer} (+
                {entry.score} points)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;
