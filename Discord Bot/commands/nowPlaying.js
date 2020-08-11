const queue = require('./queue.js');
module.exports = {
    name: "nowplaying",
    description: "Find out the current song that's playing",
    execute(msg, argsArray) {
        var serverQueue = queue.globalQueue.get(msg.guild.id);

        if(!serverQueue){
            msg.channel.send("No song playing right now");
        }
        else{
            msg.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
        }
    }
}
