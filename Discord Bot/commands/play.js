const ytdl = require('ytdl-core');
const disconnect = require('./disconnect.js');
module.exports = {
    name: 'play',
    description: 'Streams a youtube video, audio only',
    aliases: ['start', 'p'],
    execute(msg, serverQueue){        
        // we require() queue here instead of outside so as to avoid an infinite require loop, which causes errors
        const queue = require('./queue.js');

        /*
         * Check if play() is called directly by the user. If so, it should act equivalently to queue(). In that case,
         * we'll just call queue() then instead.
         */
        if(Array.isArray(serverQueue)){
            queue.execute(msg, serverQueue);
            return;
        }
        
        const channel = msg.member.voice.channel;
        const song = serverQueue.songs[0];
        const globalQueue = queue.globalQueue;

        // check if song is defined. If it's not, the queue is empty.
        if(!song){
            disconnect.execute(msg);
            // since the queue is empty, we delete it from the global map
            globalQueue.delete(msg.guild.id);
            msg.channel.send("No more songs to play");
            return;
        }else{
            // join and begin to play the song
            channel.join().then(connection => {
                serverQueue.connection = connection;
                msg.channel.send(`Playing: ${song.title}`);
                const stream = ytdl(song.url, {filter: 'audioonly'});
                const dispatcher = connection.play(stream);
                // when we're done, shift the array and play again until queue is empty
                dispatcher.on('finish', () => {
                    msg.channel.send("Done playing!");
                    serverQueue.songs.shift();
                    this.execute(msg, serverQueue);
                });
            });
        }
    },
};
