const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { userModel } = require("../models");
const { HttpError, controllerWrapper } = require("../helpers");

const { User } = userModel;
const { SECRET_KEY } = process.env;

const register = async (request, response, next) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
        ...request.body,
        password: hashPassword,
    });

    response.json({
        email: newUser.email,
    });
};

const login = async (request, response, next) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    console.log(SECRET_KEY);

    const payload = { id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    response.json({ token });
};

// const getContact = async (request, response, next) => {
//     const { contactId } = request.params;
//     // один з варіантів
//     // const result = await Contact.findOne({ _id: contactId });
//     const result = await Contact.findById(contactId);
//     if (!result) {
//         throw HttpError(404, "Not found");
//     }
//     response.json(result);
// };

// const addContact = async (request, response, next) => {
//     const result = await Contact.create(request.body);
//     response.status(201).json(result);
// };

// const deleteContact = async (request, response, next) => {
//     const { contactId } = request.params;
//     const result = await Contact.findByIdAndDelete(contactId);
//     if (!result) {
//         throw HttpError(404, "Not found");
//     }
//     response.json({ message: "contact deleted" });
// };

// const updateContact = async (request, response, next) => {
//     const { contactId } = request.params;
//     // поверне стару версію, а в базі документ оновить
//     // для повернення нової версії потрібен третій параметр
//     // findByIdAndUpdate запише лише ті поля які передаються
//     const result = await Contact.findByIdAndUpdate(contactId, request.body, {
//         new: true,
//     });
//     if (!result) {
//         throw HttpError(404, "Not found");
//     }
//     response.json(result);
// };

// const updateStatusContact = async (request, response, next) => {
//     const { contactId } = request.params;
//     const result = await Contact.findByIdAndUpdate(contactId, request.body, {
//         new: true,
//     });
//     if (!result) {
//         throw HttpError(404, "Not found");
//     }
//     response.json(result);
// };

module.exports = {
    register: controllerWrapper(register),
    login: controllerWrapper(login),
};
