import { verifyToken } from "../auth/jwt.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            return res.status(401).json({
                errors: 'Unauthorized'
            }).end();
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                errors: 'Unauthorized'
            }).end();
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({
            errors: "Unauthorized"
        });
    }
}
