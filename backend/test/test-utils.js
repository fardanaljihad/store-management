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

export const removeTestProduct = async () => {
    await prismaClient.product.deleteMany({
        where: {
            OR: [
                { name: "test-product" },
                { name: "updated-product" }
            ]
        }
    })
}

export const createTestProduct = async (category_id) => {
    await prismaClient.product.create({
        data: {
            name: "test-product",
            price: 3500,
            stock: 100,
            category_id: category_id
        }
    });
}

export const getTestProduct = async () => {
    return await prismaClient.product.findFirst({
        where: {
            name: 'test-product'
        }
    })
}

export const removeTestContact = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            OR: [
                { email: "test-contact@example.com" },
                { email: "updated-contact@example.com" }
            ]
    }
    })
}

export const createTestContact = async (username) => {
    await prismaClient.contact.create({
        data: {
            first_name: "test-contact",
            last_name: "test-contact",
            email: "test-contact@example.com",
            phone: "1234567890",
            username: username
        }
    });
}

export const removeTestLineItems = async () => {
    await prismaClient.orderLineItem.deleteMany({
        where: {
            product_id: (await getTestProduct()).id
        }
    })
}

export const removeTestOrder = async () => {
    await prismaClient.order.deleteMany({
        where: {
            username: "test-user"
        }
    })
}

export const createTestOrder = async () => {
    await prismaClient.order.create({
        data: {
            username: (await getTestUser()).username,
            order_line_items: {
                create: [
                    {
                        product_id: (await getTestProduct()).id,
                        quantity: 1,
                        subtotal: 3500
                    }
                ]
            },
            total: 3500,
            created_at: new Date()
        }
    });
}
