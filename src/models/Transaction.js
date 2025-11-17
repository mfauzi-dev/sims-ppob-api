import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Transaction = sequelize.define(
    "Transaction",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "services",
                key: "id",
            },
        },
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        transaction_type: {
            type: DataTypes.ENUM("TOPUP", "PAYMENT"),
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "transactions",
        timestamps: true,
        freezeTableName: true,
    }
);

export default Transaction;
