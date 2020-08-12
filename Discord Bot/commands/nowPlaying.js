const command_messages = require('../command_messages');
module.exports = {
    name: "nowplaying",
    description: "Print out the songs in the queue",
    execute(msg){
        const queue = require('./queue.js');

        // retrieve current server song queue
        var serverQueue = queue.globalQueue.get(msg.guild.id);

        // print the songs in the queue, if applicable
        if(!serverQueue){
            // empty queue -> nothing is playing
            msg.channel.send(command_messages.NO_SONG_PLAYING);
        }else{
            msg.channel.send(this.queueToString(serverQueue));
        }
    },
    /**
     * Returns a server song queue in string form, ready to be printed
     * @param {serverQueue object} serverQueue The song queue for a server, which must exist
     * @returns {String} The queue in a string form ready to be printed to a text channel
     */
    queueToString(serverQueue){
        message = "";

        // iterate through the queue and add songs to be printed, with the current (and first) one being bolded
        for(i = 0; i < serverQueue.songs.length; i++){
            message += `${i + 1}. `;
            songTitle = serverQueue.songs[i].title;
            message += (i === 0) ? `**${songTitle}**` : songTitle;
            message += "\n";
        }
        return message.trim();
    },
};
