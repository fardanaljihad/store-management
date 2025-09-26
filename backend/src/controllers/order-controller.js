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

export default {
    create
}