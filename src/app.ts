import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConfig";
import { errorHandler, handleNotFound } from "./middlewares/error.middleware";
// import v1Router from "@v1/routes";
import path from "path";
import { log } from "console";

dotenv.config();

connectDB();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use("/static", express.static(path.join(__dirname, "static")));

// app.use(
//   "/api/v1",
//   (req, _, next) => {
//     log("Request: ", req.method, req.baseUrl, req.query);

//     next();
//   },
//   v1Router
// );

app.get("/", (req: Request, res: Response) => {
  res.send("Server is working fine");
});

app.use(handleNotFound);

export default app;