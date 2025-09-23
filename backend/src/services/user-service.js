import { prismaClient } from "../applications/database.js";
import { generateToken } from "../auth/jwt.js";
import { ResponseError } from "../errors/response-error.js";
import { getAllUsersValidation, loginUserValidation, registerUserValidation } from "../validations/user-validation.js"
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

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password is wrong");
    }

    const token = generateToken(user);
    return { "token": token  };
}

const getAll = async (request) => {
    const params = validate(getAllUsersValidation, request);
    const page = params.page || 1;
    const limit = params.limit || 10;
    const role = params.role;

    const validRoles = ["MANAGER", "CASHIER"];
    if (role && !validRoles.includes(role)) {
        return {
            data: [],
            pagination: {
                total: 0,
                page,
                limit
            }
        };
    }
    
    const where = role ? { role } : {};
    const skip = (page - 1) * limit;

    const total = await prismaClient.user.count({ where });
    
    const users = await prismaClient.user.findMany({
        where,
        skip,
        take: limit,
        include: {
            contact: true
        }
    });

    return {
        data: users,
        pagination: {
            total: total,
            page: page,
            limit: limit
        }
    }
}

export default {
    register,
    login,
    getAll
}