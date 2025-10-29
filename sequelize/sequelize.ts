import { Sequelize } from "sequelize";
const config = require('./config');
const configEnv = config[process.env.NODE_ENV || "developement"];

const sequelize = new Sequelize(configEnv);