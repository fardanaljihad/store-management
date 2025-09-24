import supertest from "supertest";
import { web } from "../src/applications/web.js"
import { logger } from "../src/applications/logging.js";
import { createTestUser, generateTestToken, getTestUser, removeTestUser } from "./test-utils.js";
import bcrypt from "bcrypt";

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

        logger.info(result.body);
        
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

describe('GET /api/users', function() {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it("should get list of users", async () => {
        const result = await supertest(web)
            .get("/api/users")
            .set("Authorization", `Bearer ${await generateTestToken()}`)
            .query({ page: 1, limit: 10 });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Users fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });

    it("should get list of users filtered by role CASHIER", async () => {
        const result = await supertest(web)
            .get("/api/users")
            .set("Authorization", `Bearer ${await generateTestToken()}`)
            .query({ page: 1, limit: 10, role: "CASHIER" });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Users fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);
        result.body.data.forEach(user => {
            expect(user.role).toBe("CASHIER");
        });

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });

    it("should return empty list when no users match the role filter", async () => {
        const result = await supertest(web)
            .get("/api/users")
            .set("Authorization", `Bearer ${await generateTestToken()}`)
            .query({ page: 1, limit: 10, role: "ADMIN" });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Users fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBe(0);

        expect(result.body.pagination).toMatchObject({
            total: 0,
            page: 1,
            limit: 10
        });
    });

    it("should reject request when no token is provided", async () => {
        const result = await supertest(web)
            .get("/api/users")
            .query({ page: 1, limit: 10, role: "CASHIER" });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    }); 
})

describe('GET /api/users/:username', function() {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it("should get user by username", async () => {
        const username = "test-user";
        const result = await supertest(web)
            .get(`/api/users/${username}`)
            .set("Authorization", `Bearer ${await generateTestToken()}`)

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Users fetched successfully");
        expect(result.body.data.username).toBe("test-user");
    });

    it("should return not found when username is not found", async () => {
        const username = "user";
        const result = await supertest(web)
            .get(`/api/users/${username}`)
            .set("Authorization", `Bearer ${await generateTestToken()}`)

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject request when invalid token", async () => {
        const username = "user";
        const result = await supertest(web)
            .get(`/api/users/${username}`)
            .set("Authorization", `${await generateTestToken()}`)

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
})

describe('PATCH /api/users/:username', function() {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should update user password', async () => {
        const token = await generateTestToken();
        const username = "test-user";

        const result = await supertest(web)
            .patch(`/api/users/${username}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'newpassword'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test-user');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.role).toBe('CASHIER');

        const user = await getTestUser();
        expect(await bcrypt.compare('newpassword', user.password)).toBe(true);
    });

    it('should update user role', async () => {
        const token = await generateTestToken();
        const username = "test-user";

        const result = await supertest(web)
            .patch(`/api/users/${username}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                role: 'MANAGER'
            });

        logger.info(result.body);
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test-user');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.role).toBe('MANAGER');
    });

    it('should reject user update when request body is invalid', async () => {
        const token = await generateTestToken();
        const username = "test-user";

        const result = await supertest(web)
            .patch(`/api/users/${username}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: '',
                role: ''
            });

        logger.info(result.body);
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

});

describe('DELETE /api/users/:username', function() {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should delete user', async () => {
        const token = await generateTestToken();
        const username = "test-user";

        const result = await supertest(web)
            .delete(`/api/users/${username}`)
            .set('Authorization', `Bearer ${token}`);
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("User deleted successfully");
        expect(result.body.data.username).toBe("test-user");
        expect(result.body.data.role).toBe("CASHIER");
    });

    it('should reject delete user', async () => {
        const token = await generateTestToken();
        const username = "test-";

        const result = await supertest(web)
            .delete(`/api/users/${username}`)
            .set('Authorization', `Bearer ${token}`);
        
        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject delete user when token invalid', async () => {
        const token = await generateTestToken();
        const username = "test-";

        const result = await supertest(web)
            .delete(`/api/users/${username}`)
            .set('Authorization', `${token}`);
        
        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });
});
