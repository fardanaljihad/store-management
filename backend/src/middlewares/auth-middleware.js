import { verifyToken } from "../auth/jwt.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                errors: 'Unauthorized'
            }).end();
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                errors: 'Unauthorized'
            }).end();
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({
            success: false,
            errors: "Unauthorized"
        });
    }
}

export const permittedRoles = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                errors: "Unauthorized"
            });
        }
        next();
    };
};
