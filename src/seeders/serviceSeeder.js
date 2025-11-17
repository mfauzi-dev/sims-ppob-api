import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { v4 as uuidv4 } from "uuid";

const services = [
    {
        service_code: "PAJAK",
        service_name: "Pajak PBB",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 40000,
    },
    {
        service_code: "PLN",
        service_name: "Listrik",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 10000,
    },
    {
        service_code: "PDAM",
        service_name: "PDAM Berlangganan",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 40000,
    },
    {
        service_code: "PULSA",
        service_name: "Pulsa",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 40000,
    },
    {
        service_code: "PGN",
        service_name: "PGN Berlangganan",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 50000,
    },
    {
        service_code: "MUSIK",
        service_name: "Musik Berlangganan",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 50000,
    },
    {
        service_code: "TV",
        service_name: "TV Berlangganan",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 50000,
    },
    {
        service_code: "PAKET_DATA",
        service_name: "Paket data",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 50000,
    },
    {
        service_code: "VOUCHER_GAME",
        service_name: "Voucher Game",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 100000,
    },
    {
        service_code: "VOUCHER_MAKANAN",
        service_name: "Voucher Makanan",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 100000,
    },
    {
        service_code: "QURBAN",
        service_name: "Qurban",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 200000,
    },
    {
        service_code: "ZAKAT",
        service_name: "Zakat",
        service_icon: "https://nutech-integrasi.app/dummy.jpg",
        service_tariff: 300000,
    },
];

const seedServices = async () => {
    try {
        await sequelize.authenticate();

        for (const service of services) {
            const [serviceExists] = await sequelize.query(
                `
                SELECT * FROM services WHERE service_code = :service_code LIMIT 1
                `,
                {
                    replacements: {
                        service_code: service.service_code,
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const id = uuidv4();
            const dateTime = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

            if (!serviceExists) {
                await sequelize.query(
                    `
                    INSERT INTO services (id, service_code, service_name, service_icon, service_tariff, createdAt, updatedAt)
                    VALUES (:id, :service_code, :service_name, :service_icon, :service_tariff, :createdAt, :updatedAt)
                    `,
                    {
                        replacements: {
                            id: id,
                            service_code: service.service_code,
                            service_name: service.service_name,
                            service_icon: service.service_icon,
                            service_tariff: service.service_tariff,
                            createdAt: dateTime,
                            updatedAt: dateTime,
                        },
                        type: sequelize.QueryTypes.INSERT,
                    }
                );

                logger.info(
                    `Service dengan kode ${service.service_code} berhasil ditambahkan`
                );
            } else {
                logger.error(
                    `Service dengan kode ${service.service_code} gagal ditambahkan`
                );
            }
        }
    } catch (error) {
        logger.error(`Gagal seeding service: ${error.message}`);
    } finally {
        await sequelize.close();
    }
};

seedServices();
