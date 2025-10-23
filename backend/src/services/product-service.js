import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { getCategoryValidation } from "../validations/category-validation.js";
import { createProductValidation, deleteProductValidation, getAllProductsValidation, getProductValidation, updateProductValidation } from "../validations/product-validation.js"
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

const search = async (request) => {
    request = validate(getAllProductsValidation, request);

    const skip = (request.page - 1) * request.size;

    const filters = [];
    if (request.category_id) {
        filters.push({
            category_id: {
                equals: request.category_id
            }
        })
    }

    if (request.name) {
        filters.push({
            name: {
                contains: request.name
            } 
        })
    }

    const products = await prismaClient.product.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip,
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true
        }
    });

    const totalItems = await prismaClient.product.count({
        where: {
            AND: filters
        }
    })

    return {
        data: products,
        pagination: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
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

const del = async (id) => {
    id = validate(deleteProductValidation, id);

    const isProductExists = await prismaClient.product.findUnique({
        where: {
            id
        }
    });

    if (!isProductExists) {
        throw new ResponseError(404, "Product not found");
    }

    return prismaClient.product.delete({
        where: {
            id
        },
        select: {
            id: true,
            name: true
        }
    });
}

export default {
    create,
    search,
    get,
    update,
    del
}
