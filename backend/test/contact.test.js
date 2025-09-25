import supertest from "supertest";
import { createTestContact, createTestUser, generateTestToken, getTestUser, removeTestContact, removeTestUser } from "./test-utils";
import { logger } from "../src/applications/logging.js";
import { web } from "../src/applications/web.js";

describe('POST /api/users/:username/contacts', function() {

    beforeEach(async () => {
        await createTestUser();
    });
        
    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });
    
    it('should create contact', async () => {
        const token = await generateTestToken();
        const user = await getTestUser();

        const result = await supertest(web)
            .post(`/api/users/${user.username}/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: "Test",
                last_name: "User",
                email: "test-contact@example.com",
                phone: "1234567890"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Contact created successfully");
        expect(result.body.data.first_name).toBe("Test");
        expect(result.body.data.last_name).toBe("User");
        expect(result.body.data.email).toBe("test-contact@example.com");
        expect(result.body.data.phone).toBe("1234567890");
        expect(result.body.data.username).toBe(user.username);
    });

    it('should reject if user already has a contact', async () => {
        const token = await generateTestToken();
        const user = await getTestUser();

        let result = await supertest(web)
            .post(`/api/users/${user.username}/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: "Test",
                last_name: "User",
                email: "test-contact@example.com",
                phone: "1234567890"
            });

        result = await supertest(web)
            .post(`/api/users/${user.username}/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: "Test",
                last_name: "User",
                email: "test-contact@example.com",
                phone: "1234567890"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

});

describe('GET /api/contacts', function() {

    beforeEach(async () => {
        await createTestUser();
        const user = await getTestUser();

        await createTestContact(user.username);
    });
        
    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });
    
    it('should get list of contacts', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get(`/api/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 10 });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Contacts fetched successfully");

        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.data.length).toBeGreaterThan(0);

        expect(result.body.pagination).toMatchObject({
            total: expect.any(Number),
            page: 1,
            limit: 10
        });
    });

});

describe('GET /api/users/:username/contacts', function() {

    beforeEach(async () => {
        await createTestUser();
        const user = await getTestUser();

        await createTestContact(user.username);
    });
        
    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });
    
    it('should get contact by username', async () => {
        const token = await generateTestToken();
        const user = await getTestUser();

        const result = await supertest(web)
            .get(`/api/users/${user.username}/contacts`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Contact fetched successfully");
        expect(result.body.data.username).toBe(user.username);
    });

    it('should fail get contact when contact not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .get(`/api/users/fake-username/contacts`)
            .set('Authorization', `Bearer ${token}`);

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

});

describe('PATCH /api/users/:username/contacts', function() {

    beforeEach(async () => {
        await createTestUser();
        const user = await getTestUser();

        await createTestContact(user.username);
    });
        
    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });
    
    it('should update contact email', async () => {
        const token = await generateTestToken();
        const user = await getTestUser();

        const result = await supertest(web)
            .patch(`/api/users/${user.username}/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "updated-contact@example.com"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Contact updated successfully");
        expect(result.body.data.email).toBe("updated-contact@example.com");
        expect(result.body.data.username).toBe(user.username);
    });

    it('should fail update contact when contact not found', async () => {
        const token = await generateTestToken();

        const result = await supertest(web)
            .patch(`/api/users/fake-username/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: "Updated",
                last_name: "Contact"
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

    it('should fail update contact when email is invalid', async () => {
        const token = await generateTestToken();
        const user = await getTestUser();

        const result = await supertest(web)
            .patch(`/api/users/${user.username}/contacts`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "invalid-email"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBeDefined();
    });

});
