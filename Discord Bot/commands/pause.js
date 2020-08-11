const queue = require('./queue.js');
const command_messages = require('../command_messages.json');
module.exports = {
    name: "pause",
    description: "Pauses a currently playing video or unpauses a paused one, if applicable.",
    aliases: ['unpause'],
    execute(msg){
        var serverQueue = queue.globalQueue.get(msg.guild.id);
        // check if there is a song playing
        if(!serverQueue){
            msg.channel.send(command_messages.NO_SONG_PLAYING);
        }else{
            var isPaused = serverQueue.streamDispatcher.paused;
            if(!isPaused){
                serverQueue.streamDispatcher.pause(false);
                msg.channel.send(`Paused: ${serverQueue.songs[0].title}`);
            }else{
                serverQueue.streamDispatcher.resume();
                msg.channel.send(`Unpaused: ${serverQueue.songs[0].title}`);
            }
        }
    },
};