import Joi from "joi";

const createCategoryValidation = Joi.object({
    name: Joi.string().max(100).required()
});

const getAllCategoriesValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10)
});

const getCategoryValidation = Joi.number().integer().min(1).required();

const updateCategoryValidation = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().max(100).required()
});

const deleteCategoryValidation = Joi.number().integer().min(1).required();

export {
    createCategoryValidation,
    getAllCategoriesValidation,
    getCategoryValidation,
    updateCategoryValidation,
    deleteCategoryValidation
}