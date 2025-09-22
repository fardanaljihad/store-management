import express from "express";
import { userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";

export const web = express();
web.use(express.json());
web.use(userRouter);
web.use(errorMiddleware);
