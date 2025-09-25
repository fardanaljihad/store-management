import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { getCategoryValidation } from "../validations/category-validation.js";
import { createProductValidation, getAllProductsValidation, getProductValidation, updateProductValidation } from "../validations/product-validation.js"
import { validate } from "../validations/validation.js"

const create = async (request) => {
    const product = validate(createProductValidation, request);
    product.created_at = new Date();

    const isCategoryExists = await prismaClient.category.findUnique({
        where: {
            id: product.category_id
        }
    });

    if (!isCategoryExists) {
        throw new ResponseError(404, "Category not found");
    }

    return prismaClient.product.create({
        data: product,
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            created_at: true,
            updated_at: true
        }
    });
}

const getAll = async (request) => {
    const query = validate(getAllProductsValidation, request);
    const page = query.page;
    const limit = query.limit;
    const category_id = query.category_id;
    const name = query.name;

    const skip = (query.page - 1) * query.limit;

    const where = {};
    if (category_id) {
        where.category_id = category_id;
    }
    if (name) {
        where.name = {
            contains: name,
            // mode: "insensitive"
        };
    }

    const products = await prismaClient.product.findMany({
        where,
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true
        }
    });

    return {
        data: products,
        pagination: {
            total: products.length,
            page: page,
            limit: limit
        }
    }
}

const get = async (id) => {
    id = validate(getProductValidation, id);

    const product = await prismaClient.product.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            created_at: true,
            updated_at: true,
            category: true
        }
    });

    if (!product) {
        throw new ResponseError(404, "Product not found");
    }

    return product;
}

const update = async (id, request) => {
    const productId = validate(getProductValidation, id);

    const isProductExists = await prismaClient.product.findUnique({
        where: {
            id: productId
        }
    });

    if (!isProductExists) {
        throw new ResponseError(404, "Product not found");
    }

    const product = validate(updateProductValidation, request);

    const data = {};
    if (product.name) {
        data.name = product.name;
    }
    if (product.price) {
        data.price = product.price;
    }
    if (product.stock) {
        data.stock = product.stock;
    }
    if (product.category_id) {
        const categoryId = validate(getCategoryValidation, product.category_id);

        const isCategoryExists = await prismaClient.category.findUnique({
            where: {
                id: categoryId
            }
        });

        if (!isCategoryExists) {
            throw new ResponseError(404, "Category not found");
        }

        data.category_id = categoryId;
    }

    data.updated_at = new Date();

    return prismaClient.product.update({
        where: {
            id: productId
        },
        data: data,
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            created_at: true,
            updated_at: true,
            category: true
        }
    });
}

export default {
    create,
    getAll,
    get,
    update
}
