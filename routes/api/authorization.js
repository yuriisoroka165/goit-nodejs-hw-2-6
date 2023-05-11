const express = require("express");
const router = express.Router();

const { authorizationController } = require("../../controllers");
const { validateData } = require("../../middlewares");
const { userModel } = require("../../models");

const { schemas } = userModel;

router.post(
    "/register",
    validateData(schemas.registerSchema),
    authorizationController.register
);

router.post(
    "/login",
    validateData(schemas.registerSchema),
    authorizationController.login
);

module.exports = router;
