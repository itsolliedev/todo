const express = require('express');

const modals = express.Router();

modals.get("/", (req, res) => {
    res.send("Modals is working")
})

module.exports = modals;