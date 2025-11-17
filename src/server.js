import { app } from "./app.js";
import sequelize from "./config/database.js";
import { logger } from "./config/logger.js";
import dotenv from "dotenv";
import User from "./models/User.js";
import Banner from "./models/Banner.js";
import Service from "./models/Service.js";
import Transaction from "./models/Transaction.js";

dotenv.config();

(async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database connection has been established successfully.");

        // await Transaction.sync({ alter: true });
        // logger.info("Database synced successfully.");

        const PORT = process.env.APP_PORT || 5000;
        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error(`Unable to connect to the database: ${error.message}`);
    }
})();
