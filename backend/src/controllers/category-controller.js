import categoryService from "../services/category-service.js";

const create = async (req, res, next) => {
    try {
        const result = await categoryService.create(req.body);
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await categoryService.getAll(req.query);
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
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
        const result = await categoryService.get(id);
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = req.body;
        request.id = id;
        const result = await categoryService.update(request);
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
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
