import { logger } from "../src/applications/logging.js";
import { web } from "../src/applications/web.js";
import { createTestCategory, generateTestToken, getTestCategory, removeTestCategory, removeTestProduct } from "./test-utils.js";
import supertest from "supertest";

describe('POST /api/products', function() {

    beforeEach(async () => {
        await createTestCategory();
    });
        
    afterEach(async () => {
        await removeTestProduct();
        await removeTestCategory();
    });
    
    it('should allow manager to create product', async () => {
        const token = await generateTestToken();
        const category = await getTestCategory();

        const result = await supertest(web)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "test-product",
                price: 3500,
                stock: 100,
                category_id: category.id
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Product created successfully");
        expect(result.body.data.name).toBe("test-product");
        expect(result.body.data.price).toBe(3500);
        expect(result.body.data.stock).toBe(100);
        expect(result.body.data.category.id).toBe(category.id);
        expect(result.body.data.category.name).toBe(category.name);
        expect(result.body.data.created_at).toBeDefined();
        expect(result.body.data.updated_at).toBe(null);
    });

    it('should reject create product when user is not manager', async () => {
        const token = await generateTestToken({username: "test-user", role: "CASHIER"});

        const result = await supertest(web)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "test-product",
                price: 3500,
                stock: 100,
                category_id: 999
            });

        logger.info(result.body);

        expect(result.status).toBe(403);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject create product when category not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "test-product",
                price: 3500,
                stock: 100,
                category_id: 999
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
});