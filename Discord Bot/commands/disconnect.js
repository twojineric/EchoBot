module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot if it is in a voice channel.',
    aliases: ['leave', 'stop'],
    execute(msg, argsArray){
        const voiceChannel = msg.member.voice.channel;
        // if they are in a voice channel, then disconnect
        if(voiceChannel && msg.client.channels.cache.has(voiceChannel.id))
            voiceChannel.leave();
    },
};
