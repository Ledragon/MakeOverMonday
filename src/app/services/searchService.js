"use strict";
var d3 = require('../../d3');
function search(parsed) {
    var queue = d3.queue();
    parsed.forEach(function (p) {
        var result = [];
        queue.defer(d3.json, "http://www.omdbapi.com/?s=" + p.title);
    });
    queue.awaitAll(function (error, data) {
        if (error) {
            console.error(error);
        }
        else {
            data.forEach(function (d, i) {
                if (d.Response === 'True') {
                    var movie = parsed[i];
                    var sameYear = d.Search.filter(function (s) { return +s.Year === movie.date.getFullYear(); });
                    if (sameYear.length) {
                        movie.searchResults = sameYear;
                    }
                }
            });
        }
        console.log(JSON.stringify(parsed));
    });
}
exports.search = search;
//# sourceMappingURL=searchService.js.map