import { logger } from "../src/applications/logging.js";
import { web } from "../src/applications/web.js";
import { createTestCategory, createTestProduct, generateTestToken, getTestCategory, removeTestCategory, removeTestProduct } from "./test-utils.js";
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

describe('GET /api/users', function() {
    
    beforeEach(async () => {
        await createTestCategory();
        
        const category = await getTestCategory();

        await createTestProduct(category.id);
    });
        
    afterEach(async () => {
        await removeTestProduct();
        await removeTestCategory();
    });

    it("should get list of products", async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .query({ 
                page: 1, 
                limit: 10
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Products fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });

    it("should get list of products by category", async () => {
        const token = await generateTestToken();
        const category = await getTestCategory();

        const result = await supertest(web)
            .get("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .query({ 
                page: 1, 
                limit: 10,
                category_id: category.id
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Products fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);
        result.body.data.forEach(product => {
            expect(product.category.id).toBe(category.id);
        });

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });

    it("should get list of products by name", async () => {
        const token = await generateTestToken();
        const queryName = "product";

        const result = await supertest(web)
            .get("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .query({ 
                page: 1,
                limit: 10,
                name: queryName
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Products fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);
        result.body.data.forEach(product => {
            expect(product.name).toEqual(expect.stringContaining(queryName));
        });

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });
});
