const express = require("express");
const categories = require("./src/database/categories");
const expenses = require("./src/database/expenses");
const { OpenAI } = require("openai");
const { predictCategories } = require("./src/predictCategories");
const { contextualizate } = require("./src/contextualizate");
const { makeReport } = require("./src/makeReport");

require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.urlencoded({ extended: true }));

app.get("/tags/predictions", async (req, res) => {
    const predictions = await predictCategories({ history: expenses, inputText: req.query.expense, openai, categories, expenses });
    return res.send({ categories: predictions });
});

app.post("/expenses", (req, res) => {
    const expense = req.body;
    if (!expense.expense) {
        return res.status(400).send({ message: "The expense must have a name" });
    }
    if (!expense.amount) {
        return res.status(400).send({ message: "The expense must have an amount" });
    }
    if (!expense.date) {
        return res.status(400).send({ message: "The expense must have a date" });
    }
    if (!expense.category) {
        return res.status(400).send({ message: "The expense must have a category" });
    }
    expenses.push(expense);
    return res.send(expense);
});

app.get("/report", async (req, res) => {
    console.log("making report");
    const report = await makeReport({openai, expenses });
    const result = { report: report };
    return res.send(result);
});

app.get("/expenses", (req, res) => {
    return res.send({ expenses });
});

app.get("/context", async (req, res) => {
    const result = await contextualizate({ openai, expenses });
    return res.send(result);
});

app.get("/tags", (req, res) => {
    return res.send({ categories });
});


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});