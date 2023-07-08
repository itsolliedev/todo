const chalk = require("chalk")
const moment = require("moment")

module.exports = (text, type) => {
    switch (type) {
        case "info":
            console.log(`${chalk.bold.blue(`[INFO]`)} ${chalk.cyan(`${moment().format("L LTS")}`)} - ${text}`)
            break;
        case "error":
            console.log(`${chalk.bold.red(`[ERROR]`)} ${chalk.cyan(`${moment().format("L LTS")}`)} - ${text}`)
            break;
        case "success":
            console.log(`${chalk.bold.green(`[SUCCESS]`)} ${chalk.cyan(`${moment().format("L LTS")}`)} - ${text}`)
            break;
        case "warn":
            console.log(`${chalk.bold.yellow(`[WARN]`)} ${chalk.cyan(`${moment().format("L LTS")}`)} - ${text}`)
            break
        default:
            console.log(text)
            break;
    }
}