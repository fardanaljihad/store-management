import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import orderLineItemRepository from "../repositories/order-line-item-repository.js";
import { createOrderLineItemValidation, getAllOrderLineItemValidation, getOrderLineItemValidation } from "../validations/order-line-item-validation.js";
import { validate } from "../validations/validation.js"

const create = async (request) => {
    const orderLineItemRequest = validate(createOrderLineItemValidation, request);

    const result = await orderLineItemRepository.createTransaction(orderLineItemRequest);
    
    if (result instanceof ResponseError) {
        throw result;
    }

    return prismaClient.orderLineItem.findUnique({
        where: { id: result.id },
        select: { 
            id: true,
            order_id: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true
                } 
            },
            quantity: true,
            subtotal: true
        }
    });
}

const getAll = async (request) => {
    const query = validate(getAllOrderLineItemValidation, request);

    const skip = (query.page - 1) * query.limit;

    const where = {};
    if (query.order_id) {
        where.order_id = query.order_id;

        const order = await prismaClient.order.findUnique({
            where: { id: query.order_id }
        });

        if (!order) {
            throw new ResponseError(404, 'Order not found');
        }
    }

    return prismaClient.orderLineItem.findMany({
        where,
        skip,
        take: query.limit,
        select: { 
            id: true,
            order_id: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true
                } 
            },
            quantity: true,
            subtotal: true
        }
    });
}

const get = async (id) => {
    const orderLineItemId = validate(getOrderLineItemValidation, id);

    const orderLineItem = await prismaClient.orderLineItem.findUnique({
        where: { id: orderLineItemId },
        select: { 
            id: true,
            order_id: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true
                } 
            },
            quantity: true,
            subtotal: true
        }
    });

    if (!orderLineItem) {
        throw new ResponseError(404, 'Order line item not found');
    }

    return orderLineItem;
}

export default {
    create,
    getAll,
    get
}
