import Joi from "joi";

const createProductValidation = Joi.object({
    name: Joi.string().max(100).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().positive().required(),
    category_id: Joi.number().integer().positive().required()
});

const getAllProductsValidation = Joi.object({
    page: Joi.number().integer().positive().default(1),
    limit: Joi.number().integer().positive().default(10),
    category_id: Joi.number().integer().positive().optional(),
    name: Joi.string().max(100).optional(),
});

export {
    createProductValidation,
    getAllProductsValidation
}
