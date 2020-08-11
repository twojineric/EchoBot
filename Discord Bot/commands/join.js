const command_messages = require('../command_messages');
module.exports = {
    name: 'join',
    description: 'Joins the channel the user is in.',
    execute(msg){
        // check if the user is in a channel
        if(msg.member.voice.channel){
            msg.member.voice.channel.join();
            return true;
        }else{
            msg.channel.send(command_messages.NOT_IN_VOICE_CHANNEL);
            return false;
        }
    },
};
