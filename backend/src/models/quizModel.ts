import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface QuizAttributes {
  id: number;
  name: string;
  description: string;
}

export interface QuizCreationAttributes
  extends Optional<QuizAttributes, "id"> {}

export class Quiz
  extends Model<QuizAttributes, QuizCreationAttributes>
  implements QuizAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
}

Quiz.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "Quiz" }
);

export interface UserAttributes {
  id: string;
  userName: string;
  score: number;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public userName!: string;
  public score!: number;
}
User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "User" }
);
