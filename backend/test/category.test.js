import supertest from "supertest";
import { generateTestToken, removeTestCategory } from "./test-utils.js";
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