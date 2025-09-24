import { log } from "winston";
import userService from "../services/user-service.js"

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await userService.getAll(req.query);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await userService.get(req.params.username);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const { username } = req.params;
        const request = req.body;
        request.username = username;
        const result = await userService.update(request);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    getAll,
    get,
    update
}
