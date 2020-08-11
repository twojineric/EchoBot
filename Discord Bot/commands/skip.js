const queue = require('./queue.js');
const play = require('./play.js');
const command_messages = require('../command_messages.json')
module.exports = {
    name: 'skip',
    description: 'Skips the current playing song, if there is one.',
    execute(msg){
        const globalQueue = queue.globalQueue;
        const serverQueue = globalQueue.get(msg.guild.id);
        
        // check if there is a song playing right now.
        if(!serverQueue){
            msg.channel.send(command_messages.NO_SONG_PLAYING);
            return;
        }
        const skippedSong = serverQueue.songs.shift();
        msg.channel.send(`Skipped: ${skippedSong.title}`);
        play.execute(msg, serverQueue);
    },
};