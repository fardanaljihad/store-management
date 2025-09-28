import supertest from "supertest";
import { web } from "../src/applications/web.js";
import { createTestCategory, createTestOrder, createTestProduct, createTestUser, generateTestToken, getTestCategory, getTestOrder, getTestOrderLineItem, getTestProduct, removeTestCategory, removeTestLineItems, removeTestOrder, removeTestProduct, removeTestUser } from "./test-utils";
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

describe('GET /api/order-line-items', function() {
    
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

    it('should get all order line items', async () => {
        const token = await generateTestToken();
        const product = await getTestProduct();
        const order = await getTestOrder();

        const result = await supertest(web)
            .get('/api/order-line-items')
            .set('Authorization', `Bearer ${token}`)
            .query({
                page: 1,
                limit: 10
            });
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Order line items fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);

        const item = result.body.data[0];
        expect(item.id).toBeDefined();
        expect(item.order_id).toBe(order.id);
        expect(item.product.id).toBe(product.id);
        expect(item.product.name).toBe(product.name);
        expect(item.product.price).toBe(product.price);
        expect(item.quantity).toBe(1);
        expect(item.subtotal).toBe(product.price * 1);
    });

    it('should reject get all when order not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get('/api/order-line-items')
            .set('Authorization', `Bearer ${token}`)
            .query({
                order_id: 9999,
                page: 1,
                limit: 10
            });
        
        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/order-line-items/:id', function() {
    
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

    it('should get an order line item', async () => {
        const token = await generateTestToken();
        const order = await getTestOrder();
        const product = await getTestProduct();
        const orderLineItem = await getTestOrderLineItem();

        const result = await supertest(web)
            .get(`/api/order-line-items/${orderLineItem.id}`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(result.body);
        
        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Order line item fetched successfully");
        expect(result.body.data.id).toBe(orderLineItem.id);
        expect(result.body.data.order_id).toBe(order.id);
        expect(result.body.data.product.id).toBe(product.id);
        expect(result.body.data.product.name).toBe(product.name);
        expect(result.body.data.product.price).toBe(product.price);
        expect(result.body.data.quantity).toBe(1);
        expect(result.body.data.subtotal).toBe(product.price * 1);
    });

    it('should reject get when order line item not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get('/api/order-line-items/9999')
            .set('Authorization', `Bearer ${token}`);
        
        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/order-line-items/:id', function() {
    
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

    it('should update an order line item', async () => {
        const token = await generateTestToken();
        const orderLineItem = await getTestOrderLineItem();

        let product = await getTestProduct();

        const result = await supertest(web)
            .patch(`/api/order-line-items/${orderLineItem.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 3
            });
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Order line item updated successfully");
        expect(result.body.data.id).toBe(orderLineItem.id);
        expect(result.body.data.quantity).toBe(3);
        expect(result.body.data.subtotal).toBe(product.price * 3);

        // Verify stock is decremented
        product = await getTestProduct();
        expect(product.stock).toBe(97);

        // Verify total in order
        const order = await getTestOrder();
        expect(order.total).toBe(product.price * 3);
    });

    it('should reject update when stock is not enough', async () => {
        const token = await generateTestToken();
        const orderLineItem = await getTestOrderLineItem();

        const result = await supertest(web)
            .patch(`/api/order-line-items/${orderLineItem.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 2000
            });
        
        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject update when order line item not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .patch('/api/order-line-items/9999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 2000
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    }); 
});
