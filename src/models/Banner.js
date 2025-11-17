import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Banner = sequelize.define(
    "Banner",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        banner_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        banner_image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: "banners",
        timestamps: true,
        freezeTableName: true,
    }
);

export default Banner;
