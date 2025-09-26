import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import orderRepository from "../repositories/order-repository.js";
import { createOrderValidation, deleteOrderValidation, getAllOrdersValidation, getOrderValidation, updateOrderValidation } from "../validations/order-validation.js"
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

const getAll = async (request) => {
    const { page, limit, username } = validate(getAllOrdersValidation, request);

    const skip = (page - 1) * limit;

    const where = {};
    if (username) {
        where.username = username;
    }

    const orders = await prismaClient.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            created_at: 'desc'
        },
        select: {
            id: true,
            username: true,
            created_at: true,
            updated_at: true,
            _count: {
                select: {
                    order_line_items: true,
                },
            },
            total: true,
        }
    });

    return {
        data: orders,
        pagination: {
            total: orders.length,
            page,
            limit
        }
    };
}

const get = async (id) => {
    id = validate(getOrderValidation, id);

    const order = await prismaClient.order.findUnique({
        where: { id },
        include: {
            order_line_items: {
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
            }
        }
    });

    if (!order) {
        throw new ResponseError(404, "Order not found");
    }

    return order;
}

const update = async (id, total) => {
    id = validate(getOrderValidation, id);

    const isOrderExists = await prismaClient.order.findUnique({
        where: { id }
    });

    if (!isOrderExists) {
        throw new ResponseError(404, "Order not found");
    }

    total = validate(updateOrderValidation, total);

    return prismaClient.order.update({
        where: { id },
        data: { 
            total: total,
            updated_at: new Date()
        },
        select: {
            id: true,
            updated_at: true,
            total: true
        }
    });
}

const del = async (id) => {
    id = validate(deleteOrderValidation, id);

    const isOrderExists = await prismaClient.order.findUnique({
        where: { id }
    });

    if (!isOrderExists) {
        throw new ResponseError(404, "Order not found");
    }

    await prismaClient.orderLineItem.deleteMany({
        where: { order_id: id }
    });

    return prismaClient.order.delete({
        where: { id },
        select: {
            id: true,
            username: true
        }
    });
}

export default {
    create,
    getAll,
    get,
    update,
    del
}
