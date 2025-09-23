import supertest from "supertest";
import { web } from "../src/applications/web.js"
import { logger } from "../src/applications/logging.js";
import { createTestUser, generateTestToken, removeTestUser } from "./test-utils.js";

describe('POST /api/users', function() {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should register a new user with role MANAGER when role is provided', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test-user',
                password: 'password',
                role: 'MANAGER'
            });

        logger.info(result);
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test-user');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.role).toBe('MANAGER');
    });

    it('should register a new user with default role CASHIER when role is not provided', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test-user',
                password: 'password',
            });
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test-user');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.role).toBe('CASHIER');
    });

    it('should reject user registration when username is already taken', async () => {
        const token = await generateTestToken();

        let result = await supertest(web)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test-user',
                password: 'password'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test-user');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.role).toBe('CASHIER');

        result = await supertest(web)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test-user',
                password: 'password'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should reject user registration when request body is invalid', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should reject user registration when password exceeds 100 characters', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '',
                username: 'test-user',
                password: 'passwordaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})

describe('POST /api/users/login', function() {

    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should get token when login with correct credentials', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test-user',
                password: 'password'
            })

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe('token');
    })

    it('should can not login when password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test-user',
                password: '123'
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })

    it('should can not login when username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'user',
                password: 'password'
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })

    it('should can not login when request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})
