import supertest from "supertest";
import { web } from "../src/applications/web.js";
import { createTestCategory, createTestOrder, createTestProduct, createTestUser, generateTestToken, getTestCategory, getTestOrder, getTestProduct, removeTestCategory, removeTestLineItems, removeTestOrder, removeTestProduct, removeTestUser } from "./test-utils";
import { logger } from "../src/applications/logging.js";

describe('POST /api/order-line-items', function() {
    
    beforeEach(async () => {
        await createTestCategory();
        const category = await getTestCategory();
        await createTestProduct(category.id);
        await createTestUser();
        await createTestOrder();
    });
        
    afterEach(async () => {
        await removeTestLineItems();
        await removeTestProduct();
        await removeTestCategory();
        await removeTestOrder();
        await removeTestUser();
    });

    it('should create an order line item', async () => {
        const token = await generateTestToken();
        const product = await getTestProduct();
        const order = await getTestOrder();

        const result = await supertest(web)
            .post('/api/order-line-items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                order_id: order.id,
                product_id: product.id,
                quantity: 2
            });
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Order line item created successfully");
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.order_id).toBe(order.id);
        expect(result.body.data.product.id).toBe(product.id);
        expect(result.body.data.product.name).toBe(product.name);
        expect(result.body.data.product.price).toBe(product.price);
        expect(result.body.data.quantity).toBe(2);
        expect(result.body.data.subtotal).toBe(product.price * 2);
    });

    it('should reject create when stock is not enough', async () => {
        const token = await generateTestToken();
        const product = await getTestProduct();
        const order = await getTestOrder();

        const result = await supertest(web)
            .post('/api/order-line-items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                order_id: order.id,
                product_id: product.id,
                quantity: 2000
            });
        
        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject create when product not found', async () => {
        const token = await generateTestToken();
        const order = await getTestOrder();

        const result = await supertest(web)
            .post('/api/order-line-items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                order_id: order.id,
                product_id: 9999,
                quantity: 2
            });
        
        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
});