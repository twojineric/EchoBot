const command_messages = require('../command_messages.json');
module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot if it is in a voice channel.',
    aliases: ['leave', 'stop'],
    execute(msg){
        const queue = require('./queue.js');

        const voiceChannel = msg.member.voice.channel;
        // if they are in a voice channel, then disconnect
        if(voiceChannel && msg.client.channels.cache.has(voiceChannel.id)){
            voiceChannel.leave();

            // also, let's clear the song queue, if applicable
            // first, we have to check if it exists, of course. If it does, delete it. Otherwise, no problem.
            const globalQueue = queue.globalQueue;
            if(globalQueue.get(msg.guild.id)){
                globalQueue.get(msg.guild.id).streamDispatcher.destroy();
                globalQueue.delete(msg.guild.id);
                msg.channel.send(command_messages.QUEUE_EMPTY);
            }
        }
    },
};
