const command_messages = require('../command_messages.json');
module.exports = {
    name: 'help',
    description: 'List all commands and their usage.',
    aliases: ['?'],
    execute(msg, argsArray){
        msg.channel.send(command_messages.HELP_MESSAGE);
    },
};
