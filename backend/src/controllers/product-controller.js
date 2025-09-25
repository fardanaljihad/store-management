import productService from "../services/product-service";

const create = async (req, res, next) => {
    try {
        const result = await productService.create(req.body);
        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await productService.getAll(req.query);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.get(id);
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.update(id, req.body);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const del = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.del(id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
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
