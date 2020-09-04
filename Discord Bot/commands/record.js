const fs = require('fs');
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
                const audioStream = connection.receiver.createStream(msg.author, { mode: 'pcm' });
                audioStream.pipe(fs.createWriteStream('audioFile.pcm'));

                audioStream.on('data', () => console.log("writing data"));

                 audioStream.on('end', async () => {

                     const audioRequest = {
                         "config": {
                             "encoding": "LINEAR16",
                             "sampleRateHertz": 48000,
                             "audioChannelCount": 2,
                             "languageCode": "en-US",
                         },
                         "audio": {
                             "content": fs.readFileSync('audioFile.pcm').toString('base64'),
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

                     const response = await fetch(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${process.env.CLOUD_APIKEY}`, options);
                     const { results } = await response.json();
                     msg.channel.send(results[0].alternatives[0].transcript);

                     console.log('audioStream end');
                });
            });

        }


    },
};
