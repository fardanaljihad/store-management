import orderService from "../services/order-service.js";

const create = async (req, res, next) => {
    try {
        const result = await orderService.create(req.body);
        res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await orderService.getAll(req.query);
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await orderService.get(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await orderService.update(req.params.id, req.body.total);
        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    getAll,
    get,
    update
}