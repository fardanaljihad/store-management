import Joi from "joi";

const createProductValidation = Joi.object({
    name: Joi.string().max(100).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().positive().required(),
    category_id: Joi.number().integer().positive().required()
});

export {
    createProductValidation
}
