const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

// остаточну валідацію дані проходять тут
// допустимі варіанти
// enum: ["servers", "computers", "printers"]
// регулярний вираз для перевірки дати 10-12-2010
// match: /^\d{2}-\d{2}-\d{4}$
const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    // це другий параметр схеми
    // відключити поле версій документу та додати часові мітки створення та редагування документу
    { versionKey: false, timestamps: true }
);

// додавання до схеми middleware для правильних кодів помилок
// коли при спробі збереження сталася помилка нехай спрацює middleware
contactSchema.post("save", handleMongooseError);

// Joi схема це опис вимог до обєкта який приходить в запиті
const requiredFieldsSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    // номер телефону повинен бути у форматі (111) 111-1111
    phone: Joi.string()
        .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
        .required(),
    favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({ favorite: Joi.boolean().required() });

const schemas = {
    requiredFieldsSchema,
    updateFavoriteSchema,
};

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
