import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

import env from "./utils/validateEnv";

import connectToDb from "./config/Db";
import authRouter from "./routes/auth.routes";
// import productRouter from "./routes/product.routes.js";
// import cartRouter from "./routes/cart.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hii");
});

app.use("/api/auth", authRouter);
// app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);

app.use((req, res, next) => {
  next(createHttpError(404, "Page not found!"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "Unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.statusCode;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

app.listen(env.PORT, () => {
  connectToDb();
  console.log(`The server is running on the port: ${env.PORT}`);
});
