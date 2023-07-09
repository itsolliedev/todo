const express = require('express');
const database = require("../../utils/database.js");
const client = require("../../discord/index.js");
const config = require('../../utils/config.js');

const api = express.Router();

api.get("/", (req, res) => {
    res.send("API is working")
})

api.get("/tasks", (req, res) => {
    const sqlQuery = "SELECT * FROM todos";
    database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).send("Database error")
        } else {
            res.status(200).send(result)
        }
    })
})

const ws = require("ws")
const wss = new ws.Server({ port: 8080 });

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const newData = JSON.parse(data.toString())
        if(newData.message === "subscribe") {
            client.channels.cache.get(config.discord.channelId).send(`:warning: | New connection from \`${ws._socket.remoteAddress}\``)
            ws.send(JSON.stringify({ message: "subscribed" }))
            setInterval(() => {
                ws.send(JSON.stringify({ message: "keepAlive" }))
            }, 30*1000)
        } else if (newData.message === "createTask") {
            const sqlQuery = `INSERT INTO todos (title, description, timeMade, completed) VALUES ('${newData.task.title}', '${newData.task.description}', '${new Date().getTime()}', 0)`;
            database.query(sqlQuery, (err, result) => {
                if (err) {
                    console.log(err)
                    return ws.send(JSON.stringify({ error: true, task: "createTask", msg: "There was a error creating the task" }))
                } else {
                    client.channels.cache.get(config.discord.channelId).send(`Task \`${newData.task.title}\` created by \`${ws._socket.remoteAddress}\``)
                    const sqlQuery = "SELECT * FROM todos";
                    database.query(sqlQuery, (err, result) => {
                        if (err) {
                            ws.send(JSON.stringify({ error: true, task: "createTask", msg: "There was a error getting the tasks" }))
                        } else {
                            ws.send(JSON.stringify({ message: "taskFunction", task: "createTask", tasks: result }))
                        }
                    })
                }
            })
        } else if(newData.message === "taskFunction") {
            const task = newData.task
            const id = newData.id
            if(task === "delete") {
                const sqlQuery = `UPDATE todos SET deleted = 1 WHERE id = ${id}`;
                database.query(sqlQuery, (err, result) => {
                    if(err) {
                        console.log(err)
                        return ws.send(JSON.stringify({ error: true, task: "deleteTask", msg: "There was a error deleting the task" }))
                    }
                    client.channels.cache.get(config.discord.channelId).send(`Task \`${id}\` deleted by \`${ws._socket.remoteAddress}\``)
                    const sqlQuery = "SELECT * FROM todos";
                    database.query(sqlQuery, (err, result) => {
                        if (err) {
                           return  ws.send(JSON.stringify({ error: true, task: "deleteTask", msg: "There was a error getting the tasks" }))
                        } else {
                            ws.send(JSON.stringify({ message: "taskFunction", task: "deleteTask", tasks: result }))
                        }
                    })
                })
            } else if(task === "complete") {
                const sqlQuery = `UPDATE todos SET completed = 1, timeCompleted = ${new Date().getTime()} WHERE id = ${id}`;
                database.query(sqlQuery, (err, result) => {
                    if(err) {
                        console.log(err)
                        return ws.send(JSON.stringify({ error: true, task: "completeTask", msg: "There was a error completing the task" }))
                    }
                    client.channels.cache.get(config.discord.channelId).send(`Task \`${id}\` completed by \`${ws._socket.remoteAddress}\``)
                    const sqlQuery = "SELECT * FROM todos";
                    database.query(sqlQuery, (err, result) => {
                        if (err) {
                            return ws.send(JSON.stringify({ error: true, task: "completeTask", msg: "There was a error getting the tasks" }))
                        } else {
                            ws.send(JSON.stringify({ message: "taskFunction", task: "completeTask", tasks: result }))
                        }
                    })
                })
            }
        }
    })
})

module.exports = api;