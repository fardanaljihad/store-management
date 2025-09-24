import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { createProductValidation, getAllProductsValidation } from "../validations/product-validation.js"
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

export default {
    create,
    getAll
}
