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
        const cmd = argsArray.shift().toLowerCase();


        if(bot.commandsList.has(cmd) == false)
        {
            msg.channel.send("Command not found, use $echo help");
        }
        else
        {
            try{
                bot.commandsList.get(cmd).execute(msg, argsArray);
            } catch(err){
                console.log("Caught " + err);
                msg.channel.send("Error in executing the command.");
            }

        }

    }
});
