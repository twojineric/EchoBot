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
                if(msg.member.voice.channel) {
                    const connection = await msg.member.voice.channel.join();
                }else {
                    msg.channel.send('You need to join a voice channel first!');
                }
                break;
            }
            case 'disconnect':
            case 'leave':
            {
                // check to see if it is in a channel already
                if(msg.member.voice.channel && bot.channels.cache.has(msg.member.voice.channel.id))
                    msg.member.voice.channel.leave();
                break;
            }
            case 'play':
            case 'start':
            {
                const channel = msg.member.voice.channel;
                if(!channel) {
                    msg.channel.send("Please join a voice channel first");
                }else {
                    channel.join().then(connection => {
                        const stream = ytdl('https://www.youtube.com/watch?v=HQXKnvcDTnc', {filter: 'audioonly'});
                        const dispatcher = connection.play(stream);
                        dispatcher.on('finish', () => {
                            msg.channel.send("Done playing!");
                        });
                    });
                }
                break;
            }
            case 'help':
            {
                bot.commandsList.get('help').execute(msg, argsArray);
                break;
            }
            default:
                msg.channel.send("Command not found, use $echo help")
        }
    }
});

// possibly obscure this later
let token = "NzM0MTc0OTk4Njc5Mzg4MTkw.XxON7g.w8n4Haq_pcQomv70hWPMu19OUv";
bot.login(token + "I");
