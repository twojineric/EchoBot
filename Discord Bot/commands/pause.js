const command_messages = require('../command_messages.json');
module.exports = {
    name: "pause",
    description: "Pauses a currently playing video, if applicable.",
    execute(msg){
        const queue = require('./queue.js');
        
        var serverQueue = queue.globalQueue.get(msg.guild.id);
        // check if there is a song playing
        if(!serverQueue){
            msg.channel.send(command_messages.NO_SONG_PLAYING);
        }else{
            var isPaused = serverQueue.streamDispatcher.paused;
            if(!isPaused){
                serverQueue.streamDispatcher.pause(false);
                msg.channel.send(`Paused: **${serverQueue.songs[0].title}**`);
            }else{
                // if it's already paused, notify them, but otherwise do nothing
                msg.channel.send(`**${serverQueue.songs[0].title}** ${command_messages.ALREADY_PAUSED}`);
            }
        }
    },
};