module.exports = {
	name: 'disconnect',
	description: 'Disconnects the bot if it is in a voice channel',
    aliases: ['leave', 'd'],
	execute(msg, argsArray, bot)
    {
        if(msg.member.voice.channel && bot.channels.cache.has(msg.member.voice.channel.id))
            msg.member.voice.channel.leave();
	},
};
