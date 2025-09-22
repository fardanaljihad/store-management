import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { registerUserValidation } from "../validations/user-validation.js"
import { validate } from "../validations/validation.js"
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists")
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            role: true
        }
    });
}

export default {
    register
}