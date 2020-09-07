const join = require('./join.js');
const GoogleSTT = require('@google-cloud/speech');
const speechClient = new GoogleSTT.SpeechClient();
const fetch = require('node-fetch');
require('dotenv').config();
module.exports = {
    name: 'record',
    description: 'Bot joins and starts recording the requesters speech until they stop talking',
    async execute(msg, argsArray){
        if(!join.execute(msg, argsArray))
        {
            return;
        }
        else
        {
            msg.member.voice.channel.join().then(connection => {
                const audioStream = connection.receiver.createStream(msg.author, { mode: 'pcm'/*, end: 'manual' */});
                //stream is 16bit stereo little-endian PCM audio

                //setTimeout(alertFunc, 5000, msg, audioStream);

                let dataStr = "";
                audioStream.on('data', (rawData) => {
                    console.log("Writing Data");
                    dataStr = dataStr + rawData.toString('base64');
                 });
     /*
                 audioStream.once('readable', () => {
                     console.log("data exists!");
                 });

                 audioStream.on('end', () => {
                    console.log("Paused");
                    console.log(dataStr.length);
                    let bufferData = audioStream.read();
                    if(null !== bufferData)
                    {
                        dataStr = dataStr + bufferData.toString('base64');
                    }
                    console.log(dataStr.length);
                    audioStream.destroy();
                 });
 */
                 audioStream.once('end', async () => {
                     if(dataStr.length == 0) return console.log("zero data received");

                     const audioRequest = {
                         "config": {
                             "encoding": "LINEAR16",
                             "sampleRateHertz": 48000,
                             "audioChannelCount": 2,
                             "languageCode": "en-US",
                         },
                         "audio": {
                             "content": dataStr,
                         },
                     };

                     const options = {
                         method: "post",
                         body: JSON.stringify(audioRequest),
                         headers: {
                             "Accept": "application/json",
                             "Content-Type": "application/json",
                         }
                     };
                     msg.channel.send("Processing now");
                     const response = await fetch(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${process.env.CLOUD_APIKEY}`, options);
                     const { results } = await response.json();
                     msg.channel.send(results[0].alternatives[0].transcript);

                     console.log('STT Done, Audiostream End');
                });
            });

        }
    },
};

//WIP
function alertFunc(msg, aS)
{
    console.log("You have been talking for 5sec now, closing stream!");
    msg.channel.send("Time limit reached. Stream Ending!");
    aS.pause();
}
