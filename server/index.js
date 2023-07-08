const express = require('express');
const path = require('path');
const log = require('../utils/log.js');
const app = express();

app.use(express.static(path.join(__dirname, '../client/static')));
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'ejs');

app.use(require("./routers/page.js"))
app.use("/api", require("./routers/api.js"))
app.use("/modals", require("./routers/modals.js"))

app.listen(3000, () => {
    log("Server is listening on port 3000", "info")
})