import { Sequelize } from "sequelize";

const sequelize = new Sequelize("quizDB", "", "", {
  dialect: "sqlite",
  storage: "./quiz.sqlite",
});

export { sequelize };
