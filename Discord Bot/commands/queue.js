const ytdl = require('ytdl-core');
const join = require('./join.js');
const play = require('./play.js');
module.exports = {
    name: 'queue',
    description: 'Adds a video to the queue',
    globalQueue: new Map(), //stores guilds that are currently using the bot
    async execute(msg, argsArray){

    const queue = this.globalQueue;
        if(!join.execute(msg, argsArray))
        {
            return;
        }
        else if(!ytdl.validateURL(argsArray[0]))
        {
            msg.channel.send("Invalid URL");
            return;
        }

        const channel = msg.member.voice.channel;
        const serverQueue = queue.get(msg.guild.id);

        const songInfo = await ytdl.getInfo(argsArray[0]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            };

        if(!serverQueue)
        {
            const queueConstructor = {
                textChannel: msg.channel,
                connection: null,
                songs: [],
                playing: true
            };

            queue.set(msg.guild.id, queueConstructor);
            queueConstructor.songs.push(song);

            try{
                play.execute(msg, queue, queueConstructor);
            } catch (err) {
                console.log(err);
                msg.channel.send("Error in playing the song");
                return;
            }
        }
        else
        {
            serverQueue.songs.push(song);
            msg.channel.send(`${song.title} has been added to the queue`);
        }

    },
};
