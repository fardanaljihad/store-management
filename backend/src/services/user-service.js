import { prismaClient } from "../applications/database.js";
import { generateToken } from "../auth/jwt.js";
import { ResponseError } from "../errors/response-error.js";
import { getAllUsersValidation, getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";
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

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: username
        },
        select: {
            username: true,
            role: true,
            contact: true
        }
    })
    
    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const isUserExists = await prismaClient.user.findUnique({
        where: {
            username: user.username
        }
    });

    console.log(request);
    
    
    if (!isUserExists) {
        throw new ResponseError(404, "User not found");
    }

    const data = {};
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }
    if (user.role) {
        data.role = user.role;
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            role: true
        }
    });
}

export default {
    register,
    login,
    getAll,
    get,
    update
}