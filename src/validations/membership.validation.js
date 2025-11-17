import Joi from "joi";

const registrationValidation = Joi.object({
    first_name: Joi.string().min(4).max(191).required(),
    last_name: Joi.string().min(4).max(191).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .max(191)
        .required()
        .messages({
            "string.email": "Parameter email tidak sesuai format",
            "string.empty": "Parameter email tidak sesuai format",
            "any.required": "Parameter email tidak sesuai format",
        }),
    password: Joi.string().min(8).max(25).required(),
});

const loginValidation = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .max(191)
        .required()
        .messages({
            "string.email": "Parameter email tidak sesuai format",
            "string.empty": "Parameter email tidak sesuai format",
            "any.required": "Parameter email tidak sesuai format",
        }),
    password: Joi.string().min(8).max(25).required().messages({
        "string.min": "Password minimal 8 karakter",
        "string.empty": "Password wajib diisi",
        "any.required": "Password wajib diisi",
    }),
});

const updateProfileValidation = Joi.object({
    first_name: Joi.string().min(4).max(191).optional(),
    last_name: Joi.string().min(4).max(191).optional(),
});

export { registrationValidation, loginValidation, updateProfileValidation };
