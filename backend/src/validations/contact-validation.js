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

export {
    createContactValidation,
    getAllContactsValidation
}
