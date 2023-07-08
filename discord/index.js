const Discord = require('discord.js');
const client = new Discord.Client({ partials: [Discord.Partials.Channel],intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages]});
const config = require("../utils/config")
const log = require("../utils/log")

client.on('ready', () => {
    log("Bot is ready!", "info")
});

client.login(config.discord.token);

module.exports = client;