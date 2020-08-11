"use strict";
const ytdl = require('ytdl-core');
const join = require('./join.js');
const play = require('./play.js');
module.exports = {
    name: 'queue',
    description: 'Adds a video to the queue',
    globalQueue: new Map(), // maps from guild.id (string) to song queues. Empty queues are deleted.
    async execute(msg, argsArray){
        const URL = argsArray[0];

        // check if they are already in a channel and, if so, if they provided a valid URL
        if(!join.execute(msg, argsArray)){
            return;
        }else if(!ytdl.validateURL(URL)){
            msg.channel.send("Invalid URL");
            return;
        }

        // retrieve this server's song queue, if it exists
        const channel = msg.member.voice.channel;
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
                msg.channel.send("Error in playing the song");
                return;
            }
        }else{
            // it already exists, which implies a song is already playing. Add the song into the queue
            serverQueue.songs.push(song);
            msg.channel.send(`${song.title} has been added to the queue`);
        }
    }
};