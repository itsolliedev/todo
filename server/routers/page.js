const express = require('express');
const db = require("../../utils/database.js")

const page = express.Router();

page.get("/", (req, res) => {
    const sqlQuery = "SELECT * FROM todos";
    db.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).send("Database error")
        } else {
            res.status(200).render("pages/index.ejs", { tasks: result })
        }
    })
})

module.exports = page;