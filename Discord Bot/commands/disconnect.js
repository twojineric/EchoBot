module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot if it is in a voice channel',
    aliases: ['leave', 'd'],
    execute(msg, argsArray){
        const voiceChannel = msg.member.voice.channel;
        if(voiceChannel && msg.client.channels.cache.has(voiceChannel.id))
            voiceChannel.leave();
    },
};
