import jwt from "jsonwebtoken";
import { ResponseError } from "./error.middleware.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        throw new ResponseError(
            401,
            "Token tidak tidak valid atau kadaluwarsa",
            108
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { email: decoded.email };
        next();
    } catch (error) {
        throw new ResponseError(
            401,
            "Token tidak tidak valid atau kadaluwarsa",
            108
        );
    }
};
