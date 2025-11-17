import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
    loginValidation,
    registrationValidation,
    updateProfileValidation,
} from "../validations/membership.validation.js";
import { validate } from "../validations/validation.js";
import { generateAccessToken } from "../utils/generateToken.js";
import fs from "fs";
import path from "path";

export const registration = async (req, res) => {
    try {
        const registrationRequest = validate(registrationValidation, req.body);

        const [userAlreadyExists] = await sequelize.query(
            "SELECT * FROM users WHERE email = :email LIMIT 1",
            {
                replacements: {
                    email: registrationRequest.email,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (userAlreadyExists) {
            throw new ResponseError(400, "User sudah ada");
        }

        const id = uuidv4();
        const hashedPassword = await hashPassword(registrationRequest.password);
        const dateTime = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        await sequelize.query(
            `
            INSERT INTO users (id, email, first_name, last_name, password, createdAt, updatedAt)
            VALUES (:id, :email, :first_name, :last_name, :password, :createdAt, :updatedAt)
            `,
            {
                replacements: {
                    id,
                    email: registrationRequest.email,
                    first_name: registrationRequest.first_name,
                    last_name: registrationRequest.last_name,
                    password: hashedPassword,
                    createdAt: dateTime,
                    updatedAt: dateTime,
                },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        logger.info("Registrasi Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Registrasi berhasil silahkan login",
            data: null,
        });
    } catch (error) {
        logger.error(`Registrasi Gagal: ${error.message}`);
        res.status(400).json({
            status: error.customStatus || error.httpStatus,
            message: error.message,
            data: null,
        });
    }
};

export const login = async (req, res) => {
    try {
        const loginRequest = validate(loginValidation, req.body);

        const [user] = await sequelize.query(
            "SELECT * FROM users WHERE email = :email LIMIT 1",
            {
                replacements: {
                    email: loginRequest.email,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!user) {
            throw new ResponseError(401, "Username atau password salah", 103);
        }

        const isPasswordValid = await comparePassword(
            loginRequest.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new ResponseError(401, "Username atau password salah", 103);
        }

        const accessToken = generateAccessToken(user);

        logger.info("Login Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Login Sukses",
            data: {
                token: accessToken,
            },
        });
    } catch (error) {
        logger.error(`Login Gagal: ${error.message}`);
        res.status(error.httpStatus).json({
            status: error.customStatus || error.httpStatus,
            message: error.message,
            data: null,
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const [user] = await sequelize.query(
            `
            SELECT email, first_name, last_name, profile_image,
            CASE
                WHEN profile_image IS NOT NULL THEN CONCAT ('http://localhost:${process.env.APP_PORT}/uploads/', profile_image)
                ELSE NULL
            END AS profile_image
            FROM users WHERE email = :email LIMIT 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Get User Profile Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: user,
        });
    } catch (error) {
        logger.error(`Get User Profile Gagal: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const profileRequest = validate(updateProfileValidation, req.body);

        await sequelize.query(
            `
            UPDATE users
            SET first_name = :first_name, last_name = :last_name
            WHERE email = :email
            `,
            {
                replacements: {
                    email: userEmail,
                    first_name: profileRequest.first_name,
                    last_name: profileRequest.last_name,
                },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        const [updatedUser] = await sequelize.query(
            `
            SELECT email, first_name, last_name, profile_image,
            CASE
                WHEN profile_image IS NOT NULL THEN CONCAT ('http://localhost:${process.env.APP_PORT}/uploads/', profile_image)
                ELSE NULL
            END AS profile_image 
            FROM users WHERE email = :email LIMIT 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Update Profile Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Update Pofile berhasil",
            data: updatedUser,
        });
    } catch (error) {
        logger.error(`Update Profile Gagal: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfileImage = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const [user] = await sequelize.query(
            `
            SELECT email, first_name, last_name, profile_image 
            FROM users 
            WHERE email = :email LIMIT 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        let image = user.profile_image;
        if (req.file) {
            if (image) {
                const oldPath = path.join("uploads", image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            image = req.file.filename;
        }

        await sequelize.query(
            `
            UPDATE users
            SET profile_image = :image
            WHERE email = :email
            `,
            {
                replacements: {
                    email: userEmail,
                    image: image,
                },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        const [updatedUser] = await sequelize.query(
            `
            SELECT email, first_name, last_name, profile_image,
            CASE
                WHEN profile_image IS NOT NULL THEN CONCAT ('http://localhost:${process.env.APP_PORT}/uploads/', profile_image)
                ELSE NULL
            END AS profile_image 
            FROM users WHERE email = :email LIMIT 1
            `,
            {
                replacements: {
                    email: userEmail,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        logger.info("Update Profile Image Berhasil");
        return res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: updatedUser,
        });
    } catch (error) {
        logger.error(`Update Profile Image Gagal: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
