const ytsr = require('ytsr');
ytsr.do_warn_deprecate = false;
module.exports = {
    name: 'search',
    description: 'Searches youtube for the string input and returns a URL.',
    execute(msg, argsArray){

        var searchTerm = "";
        for(let word of argsArray)
        {
            searchTerm = searchTerm + " " + word;
        }
        searchTerm.trim();

        var filters;
        ytsr.getFilters(searchTerm , function(err, filters) {
            if(err)
            {
                msg.channel.send("Error when searching");
                return;
            }
            filter = filters.get('Type').find(obj => obj.name === 'Video');

            var options = {
                limit: 5,
                nextpageRef: filter.ref,
            }
            ytsr(null, options, function(err, searchResults) {
                const queue = require('./queue.js');
                if(err)
                {
                    msg.channel.send("Error when searching");
                    return;
                }
                var url = searchResults["items"][0]['link'].toString();
                var urlArray = [];
                urlArray.push(url);
                msg.channel.send("Searching...");
                queue.execute(msg, urlArray);
                return;
            });
        });
    },
};
