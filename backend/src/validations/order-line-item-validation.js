import Joi from 'joi';

const createOrderLineItemValidation = Joi.object({
    order_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
});

export {
    createOrderLineItemValidation,
}
