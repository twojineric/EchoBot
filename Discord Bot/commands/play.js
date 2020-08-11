const ytdl = require('ytdl-core');
const disconnect = require('./disconnect.js');
module.exports = {
    name: 'play',
    description: 'Streams a youtube video, audio only',
    aliases: ['start', 'p'],
    execute(msg, queue, queueConst){

        const channel = msg.member.voice.channel;
        const serverQueue = queue.get(msg.guild.id);
        const song = queueConst.songs[0];

        if(!song){
            disconnect.execute(msg);
            queue.delete(msg.guild.id);
            msg.channel.send("No more songs to play");
            return;
        }

        channel.join().then(connection => {
            queueConst.connection = connection;
            msg.channel.send(`Playing: ${song.title}`);
            const stream = ytdl(song.url, {filter: 'audioonly'});
            const dispatcher = connection.play(stream);
            dispatcher.on('finish', () => {
                msg.channel.send("Done playing!");
                serverQueue.songs.shift();
                this.execute(msg, queue, queueConst);
            });
        });


    },
};
