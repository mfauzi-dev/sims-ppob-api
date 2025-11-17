import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import {
    topupValidation,
    transactionValidation,
} from "../validations/transaction.validation.js";
import { validate } from "../validations/validation.js";
import { v4 as uuidv4 } from "uuid";

export const getUserBalance = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const [balance] = await sequelize.query(
            `
            SELECT balance
            FROM users
            WHERE email = :email
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Get User Balance Berhasil Didapatkan");
        return res.status(200).json({
            status: 0,
            message: "Get Balance Berhasil",
            data: balance,
        });
    } catch (error) {
        logger.error(`Get User Balance Gagal Didapatkan: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const topUp = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const transactionRequest = validate(topupValidation, req.body);

        const [user] = await sequelize.query(
            `
            SELECT * FROM users
            WHERE email = :email limit 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan", 102);
        }

        // Get service berdasarkan code = TOPUP
        const [service] = await sequelize.query(
            `
            SELECT * FROM services WHERE service_code = 'TOPUP' LIMIT 1  
            `,
            {
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!service) {
            throw new ResponseError(
                400,
                "Service ataus Layanan tidak ditemukan",
                102
            );
        }

        const transactionId = uuidv4();
        const invoice_number = `INV-${Date.now()}-${Math.floor(
            Math.random() * 1000
        )}`;
        const dateTime = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        // Create transaksi baru
        await sequelize.query(
            `
            INSERT INTO transactions
                (id, user_id, service_id, invoice_number, transaction_type, amount, createdAt, updatedAt)
            VALUES
                (:id, :user_id, :service_id, :invoice_number, :transaction_type, :amount, :createdAt, :updatedAt)
            `,
            {
                replacements: {
                    id: transactionId,
                    user_id: user.id,
                    service_id: service.id,
                    invoice_number: invoice_number,
                    transaction_type: "TOPUP",
                    amount: transactionRequest.top_up_amount,
                    createdAt: dateTime,
                    updatedAt: dateTime,
                },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        // Update saldo user
        await sequelize.query(
            `
            UPDATE users
                SET balance = balance + :amount
            WHERE email = :email
            `,
            {
                replacements: {
                    amount: transactionRequest.top_up_amount,
                    email: userEmail,
                },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        const [updatedUser] = await sequelize.query(
            `
            SELECT balance
            FROM users WHERE email = :email LIMIT 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Topup Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Top Up Balance berhasil",
            data: updatedUser,
        });
    } catch (error) {
        logger.error(`Topup Gagal: ${error.message}`);
        res.status(400).json({
            status: error.customStatus || error.httpStatus,
            message: error.message,
            data: null,
        });
    }
};

export const transaction = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const transactionRequest = validate(transactionValidation, req.body);

        const [user] = await sequelize.query(
            `
            SELECT * FROM users
            WHERE email = :email limit 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan", 102);
        }

        // Get Service berdasarkan kode
        const [service] = await sequelize.query(
            `
            SELECT * FROM services WHERE service_code = :service_code LIMIT 1  
            `,
            {
                replacements: {
                    service_code: transactionRequest.service_code,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!service) {
            throw new ResponseError(
                400,
                "Service ataus Layanan tidak ditemukan",
                102
            );
        }

        // Cek apakah saldo cukup untuk melakukan transaction
        if (user.balance < service.service_tariff) {
            throw new ResponseError(404, "Saldo anda tidak cukup", 102);
        }

        const transactionId = uuidv4();
        const invoice_number = `INV-${Date.now()}-${Math.floor(
            10000 + Math.random() * 90000
        )}`;
        const dateTime = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        // Create transaksi baru
        await sequelize.query(
            `
            INSERT INTO transactions
                (id, user_id, service_id, invoice_number, transaction_type, amount, createdAt, updatedAt)
            VALUES
                (:id, :user_id, :service_id, :invoice_number, :transaction_type, :amount, :createdAt, :updatedAt)
            `,
            {
                replacements: {
                    id: transactionId,
                    user_id: user.id,
                    service_id: service.id,
                    invoice_number: invoice_number,
                    transaction_type: "PAYMENT",
                    amount: service.service_tariff,
                    createdAt: dateTime,
                    updatedAt: dateTime,
                },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        const [transaction] = await sequelize.query(
            `
            SELECT t.id, t.user_id, t.service_id, t.invoice_number, t.transaction_type, t.amount, t.createdAt,
                s.service_name as service_name, s.service_code as service_code
            FROM transactions t
            LEFT JOIN services s ON s.id = t.service_id
            WHERE t.id = :id
            `,
            {
                replacements: {
                    id: transactionId,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Update saldo user
        await sequelize.query(
            `
            UPDATE users
            SET balance = balance - :amount
            WHERE id = :user_id
            `,
            {
                replacements: {
                    amount: service.service_tariff,
                    user_id: user.id,
                },
                type: sequelize.QueryTypes.UPDATE,
            }
        );
        logger.info("Transaksi Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Transaksi berhasil",
            data: {
                invoice_number: transaction.invoice_number,
                service_code: transaction.service_code,
                service_name: transaction.service_name,
                transaction_type: transaction.transaction_type,
                total_amount: transaction.amount,
                created_on: transaction.createdAt,
            },
        });
    } catch (error) {
        logger.error(`Transaksi Gagal: ${error.message}`);
        res.status(400).json({
            status: error.customStatus || error.httpStatus,
            message: error.message,
            data: null,
        });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const [user] = await sequelize.query(
            `
            SELECT * FROM users
            WHERE email = :email limit 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const { page = 1, perPage = 3 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const transactionHistory = await sequelize.query(
            `
            SELECT t.id, t.user_id, t.service_id, t.invoice_number, t.transaction_type, t.amount, t.createdAt,
                s.service_name as service_name, s.service_code as service_code
            FROM transactions t
            LEFT JOIN services s ON s.id = t.service_id
            WHERE t.user_id = :user_id
            ORDER BY t.createdAt
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    user_id: user.id,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM transactions t
            LEFT JOIN services s ON s.id = t.service_id
            WHERE t.user_id = :user_id
            `,
            {
                replacements: {
                    user_id: user.id,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Transaction History Berhasil Didapatkan");
        return res.status(200).json({
            status: 0,
            message: "Get History Berhasil",
            data: {
                offset,
                limit,
                records: transactionHistory.map((t) => ({
                    invoice_number: t.invoice_number,
                    service_code: t.service_code,
                    service_name: t.service_name,
                    transaction_type: t.transaction_type,
                    total_amount: t.amount,
                    created_on: t.createdAt,
                })),
            },
        });
    } catch (error) {
        logger.error(`Transaction History Gagal Didapatkan: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
