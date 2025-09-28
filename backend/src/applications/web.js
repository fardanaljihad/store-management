import express from "express";
import { categoryRouter, contactRouter, orderLineItemRouter, orderRouter, productRouter, userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";

export const web = express();
web.use(express.json());

web.use(publicRouter);

web.use(userRouter);
web.use(contactRouter);
web.use(categoryRouter);
web.use(productRouter);
web.use(orderRouter);
web.use(orderLineItemRouter);

web.use(errorMiddleware);
