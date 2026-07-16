import express from 'express';
import dotenv from 'dotenv';
import {sequelize} from './src/service/database.js';
dotenv.config ();
const app = express ();
const port = process.env.PORT || 3000;

app.get ('/', (req, res) => {
  res.send ('Hello Server');
});

const startServer = async () => {
  try {
    await sequelize.authenticate ();
    console.log ('✔ Database connected successfully!');
    app.listen (port, () => {
      console.log (`server is running at port ${port}`);
    });
  } catch (error) {
    console.log ('😱 Unable to connect to the database', error);
  }
};

startServer ();
