import express from "express";
import { categoryRouter, productRouter, userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";

export const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(categoryRouter);
web.use(productRouter);
web.use(errorMiddleware);
