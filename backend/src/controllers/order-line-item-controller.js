import orderLineItemService from "../services/order-line-item-service.js";

const create = async (req, res, next) => {
    try {
        const result = await orderLineItemService.create(req.body);
        res.status(200).json({
            success: true,
            message: "Order line item created successfully",
            data: result
        }).end();
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await orderLineItemService.getAll(req.query);
        res.status(200).json({
            success: true,
            message: "Order line items fetched successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await orderLineItemService.get(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order line item fetched successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await orderLineItemService.update(req.params.id, req.body.quantity);
        res.status(200).json({
            success: true,
            message: "Order line item updated successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const del = async (req, res, next) => {
    try {
        const result = await orderLineItemService.del(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order line item deleted successfully",
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
    update,
    del
}
