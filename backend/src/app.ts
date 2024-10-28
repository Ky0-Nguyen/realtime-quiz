import express from "express";
import http from "http";
import { Server } from "socket.io";
import quizRoutes from "./routes/quizRoutes";
import { quizSocketHandler } from "./websockets/quizSocket";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(express.json());
app.use("/api", quizRoutes);
app.get("/", (req, res) => {
  res.send("Quiz App is running!");
});

quizSocketHandler(io);

export { app, server, io };
