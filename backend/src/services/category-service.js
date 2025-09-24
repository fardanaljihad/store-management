import { prismaClient } from "../applications/database";
import { ResponseError } from "../errors/response-error.js";
import { createCategoryValidation, getAllCategoriesValidation } from "../validations/category-validation.js";
import { validate } from "../validations/validation.js";

const create = async (request) => {
    const category = validate(createCategoryValidation, request);

    const countCategory = await prismaClient.category.count({
        where: {
            name: category.name
        }
    });

    if (countCategory === 1) {
        throw new ResponseError(400, "Category already exists");
    }

    return prismaClient.category.create({
        data: {
            name: category.name
        },
        select: {
            name: true
        }
    });
}

const getAll = async (request) => {
    const params = validate(getAllCategoriesValidation, request);
    const { page, limit } = params;

    const skip = (page - 1) * limit;

    const categories = await prismaClient.category.findMany({
        skip,
        take: limit
    });

    return {
        data: categories,
        pagination: {
            total: categories.length,
            page: page,
            limit: limit
        }
    }
}

export default {
    create,
    getAll
}
