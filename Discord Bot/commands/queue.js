const ytdl = require('ytdl-core');
const command_messages = require('../command_messages.json');
module.exports = {
    name: 'queue',
    description: 'Adds a video to the queue.',
    globalQueue: new Map(), // maps from guild.id (Snowflake ID) to song queues. Empty queues are deleted.
    async execute(msg, argsArray){
        const join = require('./join.js');
        const play = require('./play.js');
        const search = require('./search.js');

        // handle the empty arguments case
        if(argsArray.length === 0){
            msg.channel.send(command_messages.NO_URL_SPECIFIED);
            return;
        }

        var URL = argsArray[0];
        /* Attempt to join the user's channel, if they are in one, by delegating to the join command.
         * Next, check if the string provided is a valid URL. If it is not, treat it as a series of search keywords.
         * Then, attempt to search for a corresponding video.
         */
        if(!join.execute(msg, argsArray)){
            return;
        }else if(argsArray.length > 1 || !ytdl.validateURL(URL)){ // URL will only have one argument, guaranteed
            msg.channel.send(command_messages.SEARCHING_FOR_SONG);
            search.execute(msg, argsArray);
            return;
        }

        // at this point, the URL has been validated, and we know it's a URL (not a search pattern)

        // retrieve this server's song queue, if it exists
        const serverQueue = this.globalQueue.get(msg.guild.id);

        // create a song object for the info for this video, which is guaranteed to be a valid URL
        const songInfo = await ytdl.getInfo(URL);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        // now, add the song into the queue. To do so, check if the queue exists
        if(!serverQueue){
            // if there's no queue for this server, let's construct one
            const newServerQueue = {
                textChannel: msg.channel,
                connection: null,
                songs: [],
                playing: true,
                streamDispatcher: null
            };

            // add this newly created server queue to the global queue and add in the song
            this.globalQueue.set(msg.guild.id, newServerQueue);
            newServerQueue.songs.push(song);

            // since the serverQueue didnt't exist, there wasn't a video already playing. Attempt to play the song.
            try{
                play.execute(msg, newServerQueue);
            }catch(err){
                console.error(err);
                msg.channel.send(command_messages.SONG_ERROR);
                return;
            }
        }else{
            // it already exists, which implies a song is already playing. Add the song into the queue
            serverQueue.songs.push(song);
            msg.channel.send(`${song.title} ${command_messages.ADDED_TO_QUEUE}`);
        }
    },
};
