import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import orderRepository from "../repositories/order-repository.js";
import { createOrderValidation } from "../validations/order-validation.js"
import { validate } from "../validations/validation.js"

const create = async (request) => {
    const requestOrder = validate(createOrderValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: requestOrder.username
        }
    });

    if (!user) {
        throw new ResponseError("User not found");
    }

    const total = requestOrder.order_line_items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const order = await orderRepository.orderTransaction(requestOrder.username, total, requestOrder.order_line_items);
    
    const orderLineItems = await prismaClient.orderLineItem.findMany({
        where: { 
            order_id: order.id 
        },
        select: { 
            id: true,
            quantity: true,
            subtotal: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true
                } 
            }
        }
    });
    
    return {
        ...order,
        order_line_items: orderLineItems
    };
}

export default {
    create
}
