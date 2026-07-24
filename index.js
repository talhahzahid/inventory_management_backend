import express from 'express';
import dotenv from 'dotenv';
import {sequelize} from './src/config/database.js';
import './src/models/index.js';
import roleRouter from './src/routes/role.routes.js';
import companyRouter from './src/routes/company.routes.js';
dotenv.config ();
const app = express ();
const port = process.env.PORT || 3000;

app.use (express.json ());
// app.use
app.get ('/', (req, res) => {
  res.send ('Hello Server');
});

app.use ('/api/v1', roleRouter);
app.use ('/api/v2', companyRouter);

const startServer = async () => {
  try {
    await sequelize.authenticate ();
    await sequelize.sync ();
    console.log ('✔ Database connected successfully!');
    app.listen (port, () => {
      console.log (`server is running at port ${port}`);
    });
  } catch (error) {
    console.log ('😱 Unable to connect to the database', error);
  }
};

startServer ();
