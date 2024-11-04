

import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "node:http";
import {connectTosoc} from "./controllers/socketManager.js";
dotenv.config();

const app = express();
app.use(express.json({limit:"40kb"}));
app.use(urlencoded({extended:true,limit:"40kb"}));
const server = createServer(app);
const io=connectTosoc(server);

app.use(cors());
app.set("PORT", process.env.PORT || 8000);
app.set("MONGOURL", process.env.MONGOURL);

app.get("/home", (req, res) => {
  res.send("Hello, this is home");
});

const run = async () => {
  try {
    const mongodbcon = await mongoose.connect(app.get("MONGOURL"), {});
    console.log(`db is connected ${mongodbcon.connection.host}`);

    server.listen(app.get("PORT"), () => {
      console.log(`Server is listening on port ${app.get("PORT")}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

run();
