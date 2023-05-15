const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/api/authorization");
const contactsRouter = require("./routes/api/contacts");

const application = express();

const formatsLogger = application.get("env") === "development" ? "dev" : "short";

application.use(logger(formatsLogger));
application.use(cors());
// перевіряє тіло запиту на content type application/json і повертає обєкт
application.use(express.json());
// дозволяємо брати статичні файли в папці public
application.use(express.static("public"));

application.use("/users", usersRouter);
application.use("/api/contacts", contactsRouter);

application.use((request, response) => {
    response.status(404).json({ message: "Not found" });
});

// функція з 4 параметрами це функція обробник помилок (де перший параметр це помилка)
application.use((error, request, response, next) => {
    const { status = 500, message = "Server error" } = error;
    response.status(status).json({ message });
});

module.exports = application;
