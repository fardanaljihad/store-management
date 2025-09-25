import contactService from "../services/contact-service.js";

const create = async (req, res, next) => {
    try {
        const username = req.params.username;
        const result = await contactService.create(username, req.body);
        res.status(200).json({
            success: true,
            message: "Contact created successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await contactService.getAll(req.query);
        res.status(200).json({
            success: true,
            message: "Contacts fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    getAll
}
