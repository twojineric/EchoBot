const queue = require('./queue.js');
module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot if it is in a voice channel.',
    aliases: ['leave', 'stop'],
    execute(msg){
        // if the bot isnt in a voice channel in that server, then do nothing
        if(!msg.guild.voiceConnection){
            return;
        }
        
        // also, let's clear the song queue, if applicable
        msg.guild.voiceConnection.disconnect();
        // first, we have to check if it exists, of course. If it does, delete it. Otherwise, no problem.
        const globalQueue = queue.globalQueue;
        if(globalQueue.get(msg.guild.id)){
            globalQueue.delete(msg.guild.id);
        }
    },
};
