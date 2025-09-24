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

export default {
    create
}
