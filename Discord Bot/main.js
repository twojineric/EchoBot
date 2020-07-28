const fs = require ('fs');
require('dotenv').config();
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const bot = new Discord.Client();
bot.commandsList = new Discord.Collection(); //Map (Collection) of commands
var commandFiles = fs.readdirSync('./commands');
var commandFiles = commandFiles.filter(file => file.endsWith('.js'));

for(let file of commandFiles)
{
    const command = require(`./commands/${file}`);
    bot.commandsList.set(command.name, command);
}

const keyword = '$echo'; //$echo is the command word
const abbrKey = '$e '; //whitespace after included!

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.login(process.env.DISCORD_TOKEN);

bot.on('message', msg => {

    if((msg.content.substring(0, 5) === keyword || msg.content.substring(0, 3) === abbrKey)
        && !msg.author.bot)
    {
        const argsArray = msg.content.trim().split(/ +/);
        argsArray.shift(); //removes the keyword
        const cmd = argsArray.shift();

        switch(cmd) {

            case 'join':
            {
                bot.commandsList.get('join').execute(msg, argsArray);
                break;
            }
            case 'disconnect':
            case 'leave':
            {
                bot.commandsList.get('disconnect').execute(msg, argsArray);
                break;
            }
            case 'play':
            case 'start':
            {
                bot.commandsList.get('play').execute(msg, argsArray);
                break;
            }
            case 'help':
            {
                bot.commandsList.get('help').execute(msg, argsArray);
                break;
            }
            default:
                msg.channel.send("Command not found, use $echo help");

        }
    }
});
