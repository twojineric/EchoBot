const command_messages = require('../command_messages');
module.exports = {
    name: "nowplaying",
    description: "Find out the current song that's playing",
    execute(msg){
        const queue = require('./queue.js');
        
        // retrieve current server song queue
        var serverQueue = queue.globalQueue.get(msg.guild.id);
        
        // print the song that is currently playing, if applicable
        if(!serverQueue){
            msg.channel.send(command_messages.NO_SONG_PLAYING);
        }else{
            msg.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
        }
    }
}
