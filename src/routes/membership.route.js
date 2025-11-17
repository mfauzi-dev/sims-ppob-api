import express from "express";
import {
    getUserProfile,
    login,
    registration,
    updateProfile,
    updateProfileImage,
} from "../controllers/membership.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const membershipRoute = new express.Router();

membershipRoute.post("/registration", registration);
membershipRoute.post("/login", login);
membershipRoute.get("/profile", authenticate, getUserProfile);
membershipRoute.put("/profile/update", authenticate, updateProfile);
membershipRoute.put(
    "/profile/image",
    authenticate,
    upload.single("image"),
    updateProfileImage
);

export { membershipRoute };
