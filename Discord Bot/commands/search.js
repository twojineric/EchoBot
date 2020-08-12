const ytsr = require('ytsr');
ytsr.do_warn_deprecate = false;
const command_messages = require('../command_messages.json');
module.exports = {
    name: 'search',
    description: 'Searches youtube with string input and returns a URL.',
    execute(msg, argsArray){

        // construct the search phrase using the words in the argument array
        var searchTerm = "";
        for(let word of argsArray){
            searchTerm += " " + word;
        }
        searchTerm.trim();

        // now, search for the video with our search phrase
        var filters;
        ytsr.getFilters(searchTerm, function(err, filters){
            if(err){
                msg.channel.send(command_messages.SEARCH_ERROR);
                return;
            }
            filter = filters.get('Type').find(obj => obj.name === 'Video');

            var options = {
                limit: 5,
                nextpageRef: filter.ref,
            }
            ytsr(null, options, function(err, searchResults){
                const queue = require('./queue.js');
                if(err){
                    msg.channel.send(command_messages.SEARCH_ERROR);
                    return;
                }
                var url = searchResults["items"][0]['link'].toString();
                msg.channel.send("Searching...");
                // as queue is meant to be used with a string array, we put our URL into a one-element array and pass it
                queue.execute(msg, [url]);
                return;
            });
        });
    },
};
