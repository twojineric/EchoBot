const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  cipher(token);
});

client.on('messageDelete', msg => {
    msg.channel.send(msg);
});


// possibly obscure this later
var token = "NzM0MTc0OTk4Njc5Mzg4MTkw.XxON7g.w8n4Haq_pcQomv70hWPMu19OUv";
client.login(token + "I");