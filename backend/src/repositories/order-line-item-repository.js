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

export default {
    createTransaction,
    updateTransaction
}
