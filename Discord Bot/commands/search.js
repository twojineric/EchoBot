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

        // pulls filters for the current search phrase
        ytsr.getFilters(searchTerm, function(err, filters){
            // handle search error
            if(err){
                msg.channel.send(command_messages.SEARCH_ERROR);
                return;
            }
            
            filter = filters.get('Type').find(obj => obj.name === 'Video');
            
            // construct object to hold our search options
            var options = {
                limit: 5, // limit items pulled to 5
                nextpageRef: filter.ref, // to continue previous search/use filters
            };
            
            // by passing in a null string, we indicate that we continue the previous search
            ytsr(null, options, function(err, searchResults){
                const queue = require('./queue.js');
                
                // handle search error
                if(err){
                    msg.channel.send(command_messages.SEARCH_ERROR);
                    return;
                }
                
                // retrieve the URL of the first video (of the 5 pulled)
                var url = searchResults["items"][0]['link'].toString();
                
                // as queue is meant to be used with a string array, we put our URL into a one-element array and pass it
                queue.execute(msg, [url]);
                return;
            });
        });
    },
};
