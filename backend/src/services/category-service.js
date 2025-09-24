import { prismaClient } from "../applications/database";
import { ResponseError } from "../errors/response-error.js";
import { createCategoryValidation, deleteCategoryValidation, getAllCategoriesValidation, getCategoryValidation, updateCategoryValidation } from "../validations/category-validation.js";
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

const get = async (id) => {
    id = validate(getCategoryValidation, id);

    const category = await prismaClient.category.findUnique({
        where: {
            id: id
        }
    });

    if (!category) {
        throw new ResponseError(404, "Category not found");
    }

    return category;
}

const update = async (request) => {
    const category = validate(updateCategoryValidation, request);

    const isCategoryExists = await prismaClient.category.findUnique({
        where: {
            id: category.id
        }
    });

    if (!isCategoryExists) {
        throw new ResponseError(404, "Category not found");
    }

    const isNameExists = await prismaClient.category.findUnique({
        where: {
            name: category.name
        }
    })

    if (isNameExists) {
        throw new ResponseError(400, "Category name already exists");
    }

    return prismaClient.category.update({
        where: {
            id: category.id
        },
        data: {
            name: category.name
        }
    });
}

const deleteCategory = async (id) => {
    id = validate(deleteCategoryValidation, id);

    const isCategoryExists = await prismaClient.category.findUnique({
        where: {
            id: id
        }
    });
    
    if (!isCategoryExists) {
        throw new ResponseError(404, "Category not found");
    }

    return prismaClient.category.delete({
        where: {
            id: id
        }
    });
}

export default {
    create,
    getAll,
    get,
    update,
    deleteCategory
}
