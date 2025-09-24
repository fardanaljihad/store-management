import Joi from "joi";

const createCategoryValidation = Joi.object({
    name: Joi.string().max(100).required()
});

const getAllCategoriesValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10)
});

const getCategoryValidation = Joi.number().integer().required();

export {
    createCategoryValidation,
    getAllCategoriesValidation,
    getCategoryValidation
}