import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./src/config/database.js";
import "./src/models/index.js";
// import roleRouter from './src/routes/role.routes.js';
// import companyRouter from './src/routes/company.routes.js';
import apiRoutes from "./src/routes/index.js";
import { seedRoles } from "./src/seed/roles.seed.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello Server");
});

app.use("/api/v1", apiRoutes);
// app.use ('/api/v2', companyRouter);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedRoles();
    console.log("✔ Database connected successfully!");
    app.listen(port, () => {
      console.log(`server is running at port ${port}`);
    });
  } catch (error) {
    console.log("😱 Unable to connect to the database", error);
  }
};

startServer();
