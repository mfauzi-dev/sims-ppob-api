import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";

export const getAllBanner = async (req, res) => {
    try {
        const banners = await sequelize.query(
            `
            SELECT banner_name, banner_image, description
            FROM banners
            ORDER BY banner_name
            `,
            {
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Banner Berhasil Didapatkan");
        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: banners,
        });
    } catch (error) {
        logger.error(`Banner Gagal Didapatkan: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllService = async (req, res) => {
    try {
        const services = await sequelize.query(
            `
            SELECT service_code, service_name, service_icon, service_tariff
            FROM services
            ORDER BY service_code
            `,
            {
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Service Berhasil Didapatkan");
        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: services,
        });
    } catch (error) {
        logger.error(`Service Gagal Didapatkan: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
