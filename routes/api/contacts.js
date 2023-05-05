const express = require("express");
const router = express.Router();

const constactsController = require("../../controllers");
const { validateData, checkBody } = require("../../helpers");

router.get("/", constactsController.getContacts);
router.get("/:contactId", constactsController.getContact);
router.post("/", validateData, constactsController.addContact);
router.delete("/:contactId", constactsController.deleteContact);
router.put(
    "/:contactId",
    checkBody,
    validateData,
    constactsController.updateContact
);

module.exports = router;
