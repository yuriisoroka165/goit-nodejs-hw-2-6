const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

const getContacts = async (request, response, next) => {
    try {
        const result = await contacts.listContacts();
        if (!result) {
            throw HttpError(404, "Not found");
        }
        response.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getContacts };
