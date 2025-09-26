import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";

const createOrderLineItem = async (tx, orderId, item) => {
    // 1. Lock the product row FOR UPDATE (row-level lock)
    const [product] = await tx.$queryRaw`
        SELECT *
        FROM products
        WHERE id = ${item.product_id}
        FOR UPDATE;
    `;

    if (!product) {
        return `Product with ID ${item.product_id} not found`;
    }

    // 2. Create the order line item
    const count = await tx.$executeRaw`
        INSERT INTO order_line_items (order_id, product_id, quantity, subtotal)
        SELECT ${orderId}, p.id, ${item.quantity}, p.price * ${item.quantity}
        FROM products p
        WHERE p.stock >= ${item.quantity};
    `;
    
    if (count === 0) {
        return `${product.name} does not have enough stock for ${item.quantity}`;
    }

    // 3. Decrement product stock
    await tx.product.update({
        where: { 
            id: item.product_id 
        },
        data: { 
            stock: { 
                decrement: item.quantity 
            } 
        }
    });
    

    return null;
}

const orderTransaction = async (username, total, items) => {
    return prismaClient.$transaction(async (tx) => {
        // 1. Create the order
        const order = await tx.order.create({
            data: {
                username: username,
                created_at: new Date(),
                total
            }
        });

        // 2. For each item, create the order line item and decrement stock
        const results = await Promise.all(
            items.map(item => createOrderLineItem(tx, order.id, item))
        );

        const errors = results.filter(error => error !== null);

        if (errors.length > 0) {
            throw new ResponseError(400, errors.join(", "));
        }

        return order;
    });
}

export default {
    orderTransaction
}
