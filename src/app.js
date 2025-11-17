import express from "express";
import path from "path";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { membershipRoute } from "./routes/membership.route.js";
import { informationRoute } from "./routes/information.route.js";
import dotenv from "dotenv";
import { transactionRoute } from "./routes/transaction.route.js";

dotenv.config();

export const app = express();

app.use(
    cors({
        credentials: true,
        origin:
            process.env.CLIENT_URL ||
            process.env.CLIENT_URL ||
            "http://localhost:5173",
    })
);

app.use(express.json());

app.use(membershipRoute);
app.use(informationRoute);
app.use(transactionRoute);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(errorMiddleware);
