
const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
//$echo is the command word
    if(msg.content.substring(0, 5) === '$echo') {
        wordArray = msg.content.substring(5).split(' ');
        switch(wordArray[1]) {
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
                if(msg.member.voice.channel && client.channels.cache.has(msg.member.voice.channel.id))
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
                msg.channel.send('TBD');
                break;
            }
            default:
                'No matching command. Use $echo help'
        }
    }
});

// possibly obscure this later
let token = "NzM0MTc0OTk4Njc5Mzg4MTkw.XxON7g.w8n4Haq_pcQomv70hWPMu19OUv";
client.login(token + "I");
