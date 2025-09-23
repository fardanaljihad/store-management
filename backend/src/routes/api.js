import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter.post('/api/users', userController.register);
userRouter.get('/api/users', userController.getAll);

export {
    userRouter
}
