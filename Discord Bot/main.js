const fs = require ('fs');
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

const keyword = '$echo' //$echo is the command word

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async msg => {

    if(msg.content.substring(0, 5) === keyword && !msg.author.bot) {
        argsArray = msg.content.substring(keyword.length).trim().split(' ');

        switch(argsArray[0]) {

            case 'join':
            {
                if(msg.member.voice.channel)
                {
                    const connection = await msg.member.voice.channel.join();
                }
                else
                {
                    msg.channel.send('You need to join a voice channel first!');
                }

                break;
            }
            case 'disconnect':
            case 'leave':
            {
                bot.commandsList.get('disconnect').execute(msg, argsArray, bot);
                break;
            }
            case 'play':
            case 'start':
            {
                bot.commandsList.get('start').execute(msg, argsArray, ytdl);
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

// possibly obscure this later
let token = "NzM0MTc0OTk4Njc5Mzg4MTkw.XxON7g.w8n4Haq_pcQomv70hWPMu19OUv";
bot.login(token + "I");
