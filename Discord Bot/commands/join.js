module.exports = {
    name: 'join',
    description: 'Joins the channel the user is in',
    execute(msg, argsArray){
        // check if the user is in a channel
        if(msg.member.voice.channel){
            msg.member.voice.channel.join();
            return true;
        }else{
            msg.channel.send('You need to join a voice channel first!');
            return false;
        }

    },
};
