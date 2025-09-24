import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    role: Joi.string().valid("CASHIER", "MANAGER").default("CASHIER")
});

const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
});

const getAllUsersValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    role: Joi.string().optional()
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    role: Joi.string().valid("CASHIER", "MANAGER").optional()
});

const deleteUserValidation = Joi.string().max(100).required();

export {
    registerUserValidation,
    loginUserValidation,
    getAllUsersValidation,
    getUserValidation,
    updateUserValidation,
    deleteUserValidation
}