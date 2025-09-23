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

export default {
    register,
    login
}
