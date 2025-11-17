import sequelize from "../config/database.js";
import { logger } from "../config/logger.js";
import { v4 as uuidv4 } from "uuid";

const banners = [
    {
        banner_name: "Banner 1",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
    },
    {
        banner_name: "Banner 2",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
    },
    {
        banner_name: "Banner 3",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
    },
    {
        banner_name: "Banner 4",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
    },
    {
        banner_name: "Banner 5",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
    },
    {
        banner_name: "Banner 6",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
    },
];

const seedBanners = async () => {
    try {
        await sequelize.authenticate();

        for (const banner of banners) {
            const [bannerExists] = await sequelize.query(
                `
                SELECT * FROM banners WHERE banner_name = :banner_name LIMIT 1
                `,
                {
                    replacements: {
                        banner_name: banner.banner_name,
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const id = uuidv4();
            const dateTime = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

            if (!bannerExists) {
                await sequelize.query(
                    `
                    INSERT INTO banners (id, banner_name, banner_image, description, createdAt, updatedAt)
                    VALUES (:id, :banner_name, :banner_image, :description, :createdAt, :updatedAt)
                    `,
                    {
                        replacements: {
                            id: id,
                            banner_name: banner.banner_name,
                            banner_image: banner.banner_image,
                            description: banner.description,
                            createdAt: dateTime,
                            updatedAt: dateTime,
                        },
                        type: sequelize.QueryTypes.INSERT,
                    }
                );

                logger.info(
                    `Banner dengan nama ${banner.banner_name} berhasil ditambahkan`
                );
            } else {
                logger.error(
                    `Banner dengan nama ${banner.banner_name} gagal ditambahkan`
                );
            }
        }
    } catch (error) {
        logger.error(`Gagal seeding banner: ${error.message}`);
    } finally {
        await sequelize.close();
    }
};

seedBanners();
