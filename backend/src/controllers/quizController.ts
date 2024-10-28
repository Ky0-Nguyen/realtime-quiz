import { Request, Response } from "express";
import { Quiz } from "../models/quizModel";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
};
