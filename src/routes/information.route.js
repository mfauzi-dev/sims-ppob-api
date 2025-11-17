import express from "express";
import {
    getAllBanner,
    getAllService,
} from "../controllers/information.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const informationRoute = new express.Router();

// Banner API
informationRoute.get("/banner", getAllBanner);

// Service API
informationRoute.get("/service", authenticate, getAllService);

export { informationRoute };
