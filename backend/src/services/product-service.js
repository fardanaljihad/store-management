import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { createProductValidation } from "../validations/product-validation.js"
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

export default {
    create
}
