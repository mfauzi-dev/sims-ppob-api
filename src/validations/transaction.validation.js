import Joi from "joi";

const topupValidation = Joi.object({
    top_up_amount: Joi.number().min(0).max(5000000).required().messages({
        "any.required":
            "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "number.base":
            "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "number.min":
            "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "number.max":
            "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 5.000.000",
    }),
});

const transactionValidation = Joi.object({
    service_code: Joi.string().required(),
});
export { topupValidation, transactionValidation };
