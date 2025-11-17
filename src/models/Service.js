import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Service = sequelize.define(
    "Service",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        service_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        service_icon: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        service_tariff: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "services",
        timestamps: true,
        freezeTableName: true,
    }
);

export default Service;
