import Joi from "joi";

const createCategoryValidation = Joi.object({
    name: Joi.string().max(100).required()
});

const getAllCategoriesValidation = Joi.object({
    page: Joi.number().integer().positive().default(1),
    limit: Joi.number().integer().positive().default(10)
});

const getCategoryValidation = Joi.number().integer().positive().required();

const updateCategoryValidation = Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().max(100).required()
});

const deleteCategoryValidation = Joi.number().integer().positive().required();

export {
    createCategoryValidation,
    getAllCategoriesValidation,
    getCategoryValidation,
    updateCategoryValidation,
    deleteCategoryValidation
}