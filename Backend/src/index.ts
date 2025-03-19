import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

import env from "./utils/validateEnv";

import connectToDb from "./config/Db";
import authRouter from "./routes/auth.routes";
import { z } from "zod";
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

  // http errors
  if (isHttpError(error)) {
    statusCode = error.statusCode;
    errorMessage = error.message;
  }

  //zod errors

  if (error instanceof z.ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    // Log formatted errors

    console.error(`Zod Validation Errors:`);
    formattedErrors.forEach((error) => {
      console.error(`Field: ${error.field}, Message: ${error.message}`);
    });

    // Send formatted errors in response

    res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
    return;
  }

  res.status(statusCode).json({ error: errorMessage });
});

app.listen(env.PORT, () => {
  connectToDb();
  console.log(`The server is running on the port: ${env.PORT}`);
});
