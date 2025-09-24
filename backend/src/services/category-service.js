import { prismaClient } from "../applications/database";
import { ResponseError } from "../errors/response-error.js";
import { createCategoryValidation } from "../validations/category-validation.js";
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

export default {
    create
}
