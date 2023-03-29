require('dotenv').config();
const token = process.env.BOT_TOKEN;
const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages
    ]
});





client.on("ready", () => {
    console.log("The bee bot is online"); //message when bot is online
    //birthdayCheck();



    client.on("message", (message) => {
    
        if (message.content === "$bee") {
            console.log('test selected');
            message.channel.send("<a:capslap:809918103999873089>");
          }

    });

});

client.login(token);