import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import orderLineItemRepository from "../repositories/order-line-item-repository.js";
import { createOrderLineItemValidation } from "../validations/order-line-item-validation.js";
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

export default {
    create
}
