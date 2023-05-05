const express = require("express");
const router = express.Router();
const Joi = require("joi");

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

// Joi схема це опис вимог до обєкта
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    // номер телефону повинен бути у форматі (111) 111-1111
    phone: Joi.string()
        .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
        .required(),
});

router.get("/", async (request, response, next) => {
    try {
        const result = await contacts.listContacts();
        if (!result) {
            throw HttpError(404, "Not found");
        }
        response.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:contactId", async (request, response, next) => {
    try {
        const { contactId } = request.params;
        const result = await contacts.getContactById(contactId);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        response.json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (request, response, next) => {
    try {
        // перед додаванням дані проходять валідацію
        const { error } = addSchema.validate(request.body);
        // якщо є помилка валідації відправляємо її
        if (error) {
            const fieldName = error.details[0].path[0];
            throw HttpError(400, `missing required ${fieldName} field`);
        }
        const result = await contacts.addContact(request.body);
        response.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete("/:contactId", async (request, response, next) => {
    try {
        const { contactId } = request.params;
        const result = await contacts.removeContact(contactId);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        response.json({ message: "contact deleted" });
    } catch (error) {
        next(error);
    }
});

router.put("/:contactId", async (request, response, next) => {
    try {
        const { error } = addSchema.validate(request.body);
        if (error) {
            throw HttpError(400, `missing fields ${error.details[0].path[0]}`);
        }
        const { contactId } = request.params;
        const result = await contacts.updateContact(contactId, request.body);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        response.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
