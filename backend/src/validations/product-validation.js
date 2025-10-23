import Joi from "joi";

const createProductValidation = Joi.object({
    name: Joi.string().max(100).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().positive().required(),
    category_id: Joi.number().integer().min(1).required()
});

const getAllProductsValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).default(10),
    category_id: Joi.number().integer().min(1).optional(),
    name: Joi.string().max(100).optional(),
});

const getProductValidation = Joi.number().integer().min(1).required();

const updateProductValidation = Joi.object({
    name: Joi.string().max(100).optional(),
    price: Joi.number().positive().optional(),
    stock: Joi.number().integer().min(0).optional(),
    category_id: Joi.number().integer().min(1).optional()
});

const deleteProductValidation = Joi.number().integer().min(1).required();

export {
    createProductValidation,
    getAllProductsValidation,
    getProductValidation,
    updateProductValidation,
    deleteProductValidation
}
