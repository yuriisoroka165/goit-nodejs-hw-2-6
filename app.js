const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
// перевіряє тіло запиту на content type application/json і повертає обєкт
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((request, response) => {
    response.status(404).json({ message: "Not found" });
});

// функція з 4 параметрами це функція обробник помилок (де перший параметр це помилка)
app.use((error, request, response, next) => {
    const { status = 500, message = "Server error" } = error;
    response.status(status).json({ message });
});

module.exports = app;
