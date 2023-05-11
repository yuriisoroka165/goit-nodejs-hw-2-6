const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, "Set password for user"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter",
        },
        token: String,
    },
    { versionKey: false, timestamps: false }
);

userSchema.post("save", handleMongooseError);

const requiredFieldsSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
});

const updateFavoriteSchema = Joi.object({ favorite: Joi.boolean().required() });

const schemas = {
    requiredFieldsSchema,
    updateFavoriteSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
