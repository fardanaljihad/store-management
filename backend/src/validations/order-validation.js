import Joi from "joi";

const createOrderValidation = Joi.object({
    username: Joi.string().max(100).required(),
    order_line_items: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().required(),
            quantity: Joi.number().integer().min(1).required(),
            price: Joi.number().integer().min(0).required()
        })
    ).min(1).required()
});

const getAllOrdersValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    username: Joi.string().max(100).optional()
});

const getOrderValidation = Joi.number().integer().required();

export {
    createOrderValidation,
    getAllOrdersValidation,
    getOrderValidation
}
