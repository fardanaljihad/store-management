import { ResponseError } from "../errors/response-error.js"
import joiPkg from "joi";

const { ValidationError } = joiPkg;

const errorMiddleware = async (err, req, res, next) => {

    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            success: false,
            errors: err.message
        }).end();
    } else if (err instanceof ValidationError) {
        res.status(400).json({
            success: false,
            errors: err.message
        }).end();
    } else {
        res.status(500).json({
            success: false,
            errors: err.message
        }).end();
    }
}

export {
    errorMiddleware
}
