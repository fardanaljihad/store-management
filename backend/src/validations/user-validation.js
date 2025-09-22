import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    role: Joi.string().valid("CASHIER", "MANAGER").default("CASHIER")
});

export {
    registerUserValidation
}