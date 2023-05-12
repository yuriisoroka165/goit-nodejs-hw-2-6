const express = require("express");
const router = express.Router();

const { authorizationController } = require("../../controllers");
const { validateData, authenticate } = require("../../middlewares");
const { userModel } = require("../../models");

const { schemas } = userModel;

router.post("/register", validateData(schemas.registerSchema), authorizationController.register);
router.post("/login", validateData(schemas.registerSchema), authorizationController.login);
router.get("/current", authenticate, authorizationController.getCurrent);
router.post("/logout", authenticate, authorizationController.logout);
router.patch("/", authenticate, validateData(schemas.subscriptionSchema), authorizationController.updateSubscription);

module.exports = router;
