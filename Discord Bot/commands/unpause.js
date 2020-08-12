const command_messages = require('../command_messages.json');
module.exports = {
    name: 'unpause',
    description: 'Unpauses a currently paused video, if applicable.',
    execute(msg){
        const queue = require('./queue.js');
        
        var serverQueue = queue.globalQueue.get(msg.guild.id);
        // check if there is a song playing
        if(!serverQueue){
            msg.channel.send(command_messages.NO_SONG_PLAYING);
        }else{
            var isPaused = serverQueue.streamDispatcher.paused;
            if(!isPaused){
                // if it's not paused, then unpause shoulnd't do anything
                msg.channel.send(`**${serverQueue.songs[0].title}** ${command_messages.ALREADY_UNPAUSED}`);
            }else{
                serverQueue.streamDispatcher.resume();
                msg.channel.send(`Unpaused: **${serverQueue.songs[0].title}**`);
            }
        }
    },
}