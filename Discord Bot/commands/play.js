const ytdl = require('ytdl-core');
module.exports = {
    name: 'play',
    description: 'Streams a youtube video, audio only',
    aliases: ['start', 'p'],
    execute(msg, argsArray){

        const channel = msg.member.voice.channel;
        if(!channel){
            msg.channel.send("Please join a voice channel first");
        }else{
            channel.join().then(connection => {
                const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {filter: 'audioonly'});
                const dispatcher = connection.play(stream);
                dispatcher.on('finish', () => {
                    msg.channel.send("Done playing!");
                });
            });
        }

    },
};
