import Joi from "joi";

const createContactValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().max(200).required(),
    phone: Joi.string().max(20).required(),
});

const getAllContactsValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10)
});

const getContactValidation = Joi.string().max(100).required();

const updateContactValidation = Joi.object({
    first_name: Joi.string().max(100).optional(),
    last_name: Joi.string().max(100).optional(),
    email: Joi.string().email().max(200).optional(),
    phone: Joi.string().max(20).optional(),
});

const deleteContactValidation = Joi.string().max(100).required();

export {
    createContactValidation,
    getAllContactsValidation,
    getContactValidation,
    deleteContactValidation,
    updateContactValidation
}
