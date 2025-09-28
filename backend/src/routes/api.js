import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware, permittedRoles } from "../middlewares/auth-middleware.js";
import categoryController from "../controllers/category-controller.js";
import productController from "../controllers/product-controller.js";
import contactController from "../controllers/contact-controller.js";
import orderController from "../controllers/order-controller.js";
import orderLineItemController from "../controllers/order-line-item-controller.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter.post('/api/users', userController.register);
userRouter.get('/api/users', userController.getAll);
userRouter.get('/api/users/:username', userController.get);
userRouter.patch('/api/users/:username', userController.update);
userRouter.delete('/api/users/:username', userController.deleteUser);

const categoryRouter = express.Router();
categoryRouter.use(authMiddleware);
categoryRouter.post('/api/categories', categoryController.create);
categoryRouter.get('/api/categories', categoryController.getAll);
categoryRouter.get('/api/categories/:id', categoryController.get);
categoryRouter.patch('/api/categories/:id', categoryController.update);
categoryRouter.delete('/api/categories/:id', categoryController.deleteCategory);

const productRouter = express.Router();
productRouter.use(authMiddleware);
productRouter.post('/api/products', permittedRoles(["MANAGER"]), productController.create);
productRouter.get('/api/products', productController.getAll);
productRouter.get('/api/products/:id', productController.get);
productRouter.patch('/api/products/:id', productController.update);
productRouter.delete('/api/products/:id', permittedRoles(["MANAGER"]), productController.del);

const contactRouter = express.Router();
contactRouter.use(authMiddleware);
contactRouter.post('/api/users/:username/contacts', contactController.create);
contactRouter.get('/api/contacts', contactController.getAll);
contactRouter.get('/api/users/:username/contacts', contactController.get);
contactRouter.patch('/api/users/:username/contacts', contactController.update);
contactRouter.delete('/api/users/:username/contacts', contactController.del);

const orderRouter = express.Router();
orderRouter.use(authMiddleware);
orderRouter.post('/api/users/:username/orders', orderController.create);
orderRouter.get('/api/orders', orderController.getAll);
orderRouter.get('/api/orders/:id', orderController.get);
orderRouter.patch('/api/orders/:id', permittedRoles(["MANAGER"]), orderController.update);
orderRouter.delete('/api/orders/:id', permittedRoles(["MANAGER"]), orderController.del);

const orderLineItemRouter = express.Router();
orderLineItemRouter.use(authMiddleware);
orderLineItemRouter.post('/api/order-line-items', orderLineItemController.create);
orderLineItemRouter.get('/api/order-line-items', orderLineItemController.getAll);

export {
    userRouter,
    categoryRouter,
    productRouter,
    contactRouter,
    orderRouter,
    orderLineItemRouter
}
