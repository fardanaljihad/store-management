import { prismaClient } from "../src/applications/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'test-user'
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'test-user',
            password: await bcrypt.hash('password', 10)
        }
    })
}

export const generateTestToken = async (payload = { username: "test-user", role: "MANAGER" }) => {
    return jwt.sign(
        payload, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );
}

export const getTestUser = async () => {
    return await prismaClient.user.findUnique({
        where: {
            username: 'test-user'
        }
    })
}

export const removeTestCategory = async () => {
    await prismaClient.category.deleteMany({
        where: {
            OR: [
                { name: "test-category" },
                { name: "updated-category" }
            ]
        }
    })
}

export const createTestCategory = async () => {
    await prismaClient.category.create({
        data: {
            name: 'test-category'
        }
    })
}

export const getTestCategory = async () => {
    return await prismaClient.category.findUnique({
        where: {
            name: 'test-category'
        }
    })
}
