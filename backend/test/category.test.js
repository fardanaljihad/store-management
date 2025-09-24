import supertest from "supertest";
import { createTestCategory, generateTestToken, getTestCategory, removeTestCategory } from "./test-utils.js";
import { logger } from "../src/applications/logging.js";
import { web } from "../src/applications/web.js";

describe('POST /api/categories', function() {
    
    afterEach(async () => {
        await removeTestCategory();
    })

    it('should create category', async () => {
        const token = await generateTestToken();
        const result = await supertest(web)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'test-category'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data.name).toBe("test-category");
    });

    it('should reject create category when name already exists', async () => {
        const token = await generateTestToken();
        let result = await supertest(web)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'test-category'
            });

        result = await supertest(web)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'test-category'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/categories', function() {

    beforeEach(async () => {
        await createTestCategory();
    })
    
    afterEach(async () => {
        await removeTestCategory();
    })

    it('should get categories', async () => {
        const token = await generateTestToken();
        const result = await supertest(web)
            .get('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 10 });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Categories fetched successfully");
        
        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });

    it('should not get categories', async () => {
        const result = await supertest(web)
            .get('/api/categories')
            .query({ page: 1, limit: 10 });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/categories/:id', function() {

    beforeEach(async () => {
        await createTestCategory();
    })
    
    afterEach(async () => {
        await removeTestCategory();
    })

    it('should get category by id', async () => {
        const token = await generateTestToken();
        const category = await getTestCategory();
        const id = category.id;

        const result = await supertest(web)
            .get(`/api/categories/${id}`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Category fetched successfully");
        expect(result.body.data.name).toBe("test-category");
    });

    it('should not get category when id is not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get(`/api/categories/99999`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
})

describe('PATCH /api/categories/:id', function() {

    beforeEach(async () => {
        await createTestCategory();
    })
    
    afterEach(async () => {
        await removeTestCategory();
    })

    it('should update category', async () => {
        const token = await generateTestToken();
        const category = await getTestCategory();
        const id = category.id;

        const result = await supertest(web)
            .patch(`/api/categories/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "updated-category"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Category updated successfully");
        expect(result.body.data.name).toBe("updated-category");
    });

    it('should not update category when id is not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get(`/api/categories/99999`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it('should not update category when name already taken', async () => {
        const token = await generateTestToken();
        const category = await getTestCategory();
        const id = category.id;

        let result = await supertest(web)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "updated-category"
            });

        result = await supertest(web)
            .patch(`/api/categories/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "updated-category"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
})