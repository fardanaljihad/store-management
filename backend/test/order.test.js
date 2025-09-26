import supertest from "supertest";
import { createTestCategory, createTestProduct, createTestUser, generateTestToken, getTestCategory, getTestProduct, getTestUser, removeTestCategory, removeTestLineItems, removeTestOrder, removeTestProduct, removeTestUser } from "./test-utils.js";
import { web } from "../src/applications/web.js";
import { logger } from "../src/applications/logging.js";

describe('POST /api/users/:username/orders', function() {

    beforeEach(async () => {
        await createTestCategory();
        const category = await getTestCategory();
        await createTestProduct(category.id);
        await createTestUser();
    });
        
    afterEach(async () => {
        await removeTestLineItems();
        await removeTestProduct();
        await removeTestCategory();
        await removeTestOrder();
        await removeTestUser();
    });

    it('should create order successfully', async () => {
        const token = await generateTestToken();

        const user = await getTestUser();
        const username = user.username;

        let product = await getTestProduct();
        const productId = product.id;

        const result = await supertest(web)
            .post(`/api/users/${username}/orders`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: username,
                order_line_items: [
                    {
                        product_id: productId,
                        quantity: 100,
                        price: 3500
                    },
                ]
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Order created successfully");

        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.username).toBe(username);
        expect(result.body.data.created_at).not.toBeNull();
        expect(result.body.data.updated_at).toBeNull();
        expect(result.body.data.total).toBe(350000);

        expect(Array.isArray(result.body.data.order_line_items)).toBe(true);
        expect(result.body.data.order_line_items.length).toBe(1);
        expect(result.body.data.order_line_items[0].product.id).toBe(productId);
        expect(result.body.data.order_line_items[0].quantity).toBe(100);
        expect(result.body.data.order_line_items[0].product.price).toBe(3500);
        expect(result.body.data.order_line_items[0].subtotal).toBe(350000);

       product = await getTestProduct();
       expect(product.stock).toBe(0);
    });
    
    it('should reject order when product stock is insufficient', async () => {
        const token = await generateTestToken();

        const user = await getTestUser();
        const username = user.username;

        let product = await getTestProduct();
        const productId = product.id;

        const result = await supertest(web)
            .post(`/api/users/${username}/orders`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: username,
                order_line_items: [
                    {
                        product_id: productId,
                        quantity: 150,
                        price: 3500
                    },
                ]
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();

       product = await getTestProduct();
       expect(product.stock).toBe(100);
    });

    it('should reject order when product does not exist', async () => {
        const token = await generateTestToken();

        const user = await getTestUser();
        const username = user.username;

        const result = await supertest(web)
            .post(`/api/users/${username}/orders`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: username,
                order_line_items: [
                    {
                        product_id: 9999,
                        quantity: 150,
                        price: 3500
                    },
                ]
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
});