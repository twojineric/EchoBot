const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageDelete', msg => {
    msg.channel.send(msg);
});


// possibly obscure this later
let token = "NzM0MTc0OTk4Njc5Mzg4MTkw.XxN4eA.X_x8-bJbjQHZc2itukUSkdUoIPg";
client.login(token);