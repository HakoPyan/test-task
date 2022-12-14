require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.listen(process.env.PORT, () => console.log("Server is up..."));
