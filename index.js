require('dotenv').config(); //This lets the docuent access the .env class
const {Client, IntentsBitField} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
})

client.on('messageCreate', (msg) => {
    if(msg.author.bot) {
        return;
    }

    if(msg.content === 'Hola'){
        msg.reply('Hey boi!');
    }
})

client.login(process.env.TOKEN);