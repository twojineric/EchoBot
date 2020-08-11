const queue = require('./queue.js');
module.exports = {
    name: "pause",
    description: "Pauses a currently playing video or unpauses a paused one, if applicable.",
    execute(msg, argsArray){
        var serverQueue = queue.globalQueue.get(msg.guild.id);
        // check if there is a song playing
        if(!serverQueue){
            msg.channel.send("No song playing right now.");
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
    }
};