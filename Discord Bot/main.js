const fs = require('fs');
require('dotenv').config();
const command_messages = require('./command_messages.json');
const Discord = require('discord.js');

const bot = new Discord.Client();
bot.commandsList = new Discord.Collection(); //Map (Collection) of commands
var commandFiles = fs.readdirSync('./commands');
var commandFiles = commandFiles.filter(file => file.endsWith('.js'));

// add our commands into our map
for(let file of commandFiles){
    const command = require(`./commands/${file}`);
    bot.commandsList.set(command.name, command);

    // check if the command has aliases and add those in appropriately
    if(command.aliases){
        for(let alias of command.aliases){
            bot.commandsList.set(alias, command);
        }
    }
}

const keyword = '$echo'; //$echo is the command word
const abbrKey = '$e '; //whitespace after included!

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.login(process.env.DISCORD_TOKEN);

bot.on('message', msg => {
    // if the keyword does not match or the sender is a bot, don't do anything
    if((msg.content.substring(0, 5) === keyword || msg.content.substring(0, 3) === abbrKey) && !msg.author.bot){

        // transforms the message into an array of words
        const argsArray = msg.content.trim().split(/ +/);

        if(argsArray.length < 2)
        {
            msg.channel.send("You need to specify a command!");
            return;
        }
        argsArray.shift(); //removes keyword
        const cmd = argsArray.shift().toLowerCase();

        // perform the appropriate action for the command
        if(!bot.commandsList.has(cmd)){
            msg.channel.send(command_messages.COMMAND_NOT_FOUND);
        }else{
            try{
                bot.commandsList.get(cmd).execute(msg, argsArray);
            }catch(err){
                console.error("Caught " + err);
                msg.channel.send(`${command_messages.COMMAND_ERROR} ${cmd}.`);
            }
        }
    }



});
