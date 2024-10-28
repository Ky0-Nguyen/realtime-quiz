import { Server, Socket } from "socket.io";
import { redisClient, redisSubscriber } from "../config/redis";
import { io } from "../app";

interface User {
  userId: string;
  userName: string;
  score: number;
}

redisSubscriber.on("message", (channel, message) => {
  console.log(`Message from Redis: ${message}`);
  const { quizId, leaderBoardData } = JSON.parse(message);
  io.to(quizId).emit("leaderBoardUpdate", leaderBoardData);
});

redisSubscriber.subscribe("leaderBoardUpdate", (err) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log("Subscribed to scoreUpdate channel");
  }
});

const leaderBoard: {
  [quizId: string]: {
    [userId: string]: {
      userName: string;
      score: number;
    };
  };
} = {};

interface HistoryEntry {
  userId: string;
  userName: string;
  answer: boolean;
  score: number;
}

const leaderBoardHistories: {
  [quizId: string]: HistoryEntry[];
} = {};

export const quizSocketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`New client connected ${socket.id}`);

    const updateLeaderBoard = (quizId: string) => {
      const leaderBoardData = Object.values(leaderBoard[quizId] || {}).map(
        ({ userName, score }) => ({
          userName,
          score,
        })
      );
      redisClient.publish(
        "leaderBoardUpdate",
        JSON.stringify({
          quizId,
          leaderBoardData,
        })
      );
      io.to(quizId).emit("historyUpdate", leaderBoardHistories[quizId]);
    };

    socket.on("joinQuiz", ({ userName, quizId }) => {
      socket.join(quizId);

      leaderBoard[quizId] = leaderBoard[quizId] || {};
      leaderBoard[quizId][socket.id] = { userName, score: 0 };

      leaderBoardHistories[quizId] = leaderBoardHistories[quizId] || [];

      console.log(`User ${userName} (ID: ${socket.id}) joined quiz ${quizId}`);
      updateLeaderBoard(quizId);
    });

    socket.on("submitAnswer", ({ quizId, answer, score }) => {
      const user = leaderBoard[quizId]?.[socket.id];
      const isCorrect = answer.toLowerCase() === "correct";
      if (user) {
        user.score += isCorrect ? 10 : 0;

        console.log(
          `${user.userName} answered. Score: ${user.score}, Answer: ${answer}`
        );
        leaderBoardHistories[quizId].push({
          userId: socket.id,
          userName: user.userName,
          answer,
          score: user.score,
        });
        updateLeaderBoard(quizId);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected , ${socket.id}`);
      for (const quizId in leaderBoard) {
        delete leaderBoard[quizId][socket.id];
        updateLeaderBoard(quizId);
      }
    });
  });
};
