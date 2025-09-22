import supertest from "supertest";
import { web } from "../src/applications/web.js"
import { prismaClient } from "../src/applications/database.js";
import { logger } from "../src/applications/logging.js";

describe('POST /api/users', function() {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: 'test-user'
            }
        })
    })

    it('should register a new user with role MANAGER when role is provided', async () => {
        const result = await supertest(web)
            .post('/api/users')
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
        const result = await supertest(web)
            .post('/api/users')
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
        let result = await supertest(web)
            .post('/api/users')
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
            .send({
                username: 'test-user',
                password: 'password'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should reject user registration when request body is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should reject user registration when password exceeds 100 characters', async () => {
        const result = await supertest(web)
            .post('/api/users')
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
