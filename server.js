const application = require("./application");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);
mongoose
    .connect(DB_HOST)
    .then(() => {
        console.log("Database connection successful");
        application.listen(PORT);
    })
    .catch(error => {
        console.log(error.message);
        // закрити запущений процес при помилці підключення до бази данних
        process.exit(1);
    });
