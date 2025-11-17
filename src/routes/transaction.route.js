import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import {
    getTransactionHistory,
    getUserBalance,
    topUp,
    transaction,
} from "../controllers/transaction.controller.js";

const transactionRoute = new express.Router();

transactionRoute.get("/balance", authenticate, getUserBalance);
transactionRoute.post("/topup", authenticate, topUp);
transactionRoute.post("/transaction", authenticate, transaction);
transactionRoute.get(
    "/transaction/history",
    authenticate,
    getTransactionHistory
);

export { transactionRoute };
