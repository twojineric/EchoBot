module.exports = {
    name: 'join',
    description: 'Joins the channel the user is in',
    execute(msg, argsArray){
        if(msg.member.voice.channel){
            const connection = msg.member.voice.channel.join();
        }else{
            msg.channel.send('You need to join a voice channel first!');
        }

    },
};
