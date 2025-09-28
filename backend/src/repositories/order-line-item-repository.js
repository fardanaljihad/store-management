import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";

const createTransaction = async (request) => {
    return prismaClient.$transaction(async (tx) => {
        // 1. Lock the product row FOR UPDATE (row-level lock)
        const [product] = await tx.$queryRaw`
            SELECT *
            FROM products
            WHERE id = ${request.product_id}
            FOR UPDATE;
        `;

        if (!product) {
            return new ResponseError(404, `Product with ID ${request.product_id} not found`);
        }

        // 2. Create the order line item
        const count = await tx.$executeRaw`
            INSERT INTO order_line_items (order_id, product_id, quantity, subtotal)
            SELECT ${request.order_id}, p.id, ${request.quantity}, p.price * ${request.quantity}
            FROM products p
            WHERE p.stock >= ${request.quantity};
        `;

        if (count === 0) {
            return new ResponseError(400, `${product.name} does not have enough stock for ${request.quantity}`);
        }

        const [orderLineItem] = await tx.$queryRaw`
            SELECT id
            FROM order_line_items
            WHERE id = LAST_INSERT_ID();
        `;

        // 3. Decrement product stock
        await tx.product.update({
            where: { 
                id: request.product_id 
            },
            data: { 
                stock: { 
                    decrement: request.quantity 
                } 
            }
        });
        

        return { id: orderLineItem.id};
    });
}

const updateTransaction = async (id, quantity, productId) => {
    return prismaClient.$transaction(async (tx) => {
        // 1. Lock the product row FOR UPDATE (row-level lock)
        const [product] = await tx.$queryRaw`
            SELECT *
            FROM products
            WHERE id = ${productId}
            FOR UPDATE;
        `;

        if (!product) {
            return new ResponseError(404, `Product with ID ${productId} not found`);
        }

        // 2. Update the order line item
        const count = await tx.$executeRaw`
            UPDATE order_line_items
            SET quantity = ${quantity}, subtotal = (${product.price} * ${quantity})
            WHERE id = ${id} AND ${product.stock} >= ${quantity};
        `;

        if (count === 0) {
            return new ResponseError(400, `${product.name} does not have enough stock for ${quantity}`);
        }

        // 3. Decrement product stock
        await tx.product.update({
            where: { 
                id: productId 
            },
            data: { 
                stock: { 
                    decrement: quantity 
                } 
            }
        });
        
        return { 
            id,
            price: product.price,
        };
    });
}

const deleteTransaction = async (id) => {
    return prismaClient.$transaction(async (tx) => {

        // 1. Check order line item exists
        const orderLineItem = await prismaClient.orderLineItem.findUnique({
            where: { id },
            select: {
                order_id: true,
                product_id: true,
                quantity: true,
                subtotal: true,
            }
        });

        if (!orderLineItem) {
            return new ResponseError(404, 'Order line item not found');
        }

        // 2. Lock the product row FOR UPDATE (row-level lock)
        const [product] = await tx.$queryRaw`
            SELECT *
            FROM products
            WHERE id = ${orderLineItem.product_id}
            FOR UPDATE;
        `;

        if (!product) {
            return new ResponseError(404, `Product with ID ${orderLineItem.product_id} not found`);
        }

        // 4. Increment product stock
        await tx.product.update({
            where: { 
                id: orderLineItem.product_id 
            },
            data: { 
                stock: { 
                    increment: orderLineItem.quantity 
                } 
            }
        });

        // 5. Update order total
        const newTotal = orderLineItem.subtotal;
        await tx.order.update({
            where: { id: orderLineItem.order_id },
            data: { total: { decrement: newTotal } }
        });

        // 6. Delete the order line item
        return tx.orderLineItem.delete({
            where: { id },
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
    });
}

export default {
    createTransaction,
    updateTransaction,
    deleteTransaction
}
