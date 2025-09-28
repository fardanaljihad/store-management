import Joi from 'joi';

const createOrderLineItemValidation = Joi.object({
    order_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
});

const getAllOrderLineItemValidation = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    order_id: Joi.number().integer().optional(),
});

const getOrderLineItemValidation = Joi.number().integer().min(1).required();

const updateOrderLineItemValidation = Joi.number().integer().optional();

const deleteOrderLineItemValidation = Joi.number().integer().min(1).required();

export {
    createOrderLineItemValidation,
    getAllOrderLineItemValidation,
    getOrderLineItemValidation,
    updateOrderLineItemValidation,
    deleteOrderLineItemValidation
}
