import * as d3 from 'd3';

export function search(parsed: Array<any>) {
    var queue = d3.queue();
    parsed.forEach(p => {
        var result: Array<any> = [];
        queue.defer(d3.json, `http://www.omdbapi.com/?s=${p.title}&type=movie`);
    })
    queue.awaitAll((error: any, data: Array<any>) => {
        if (error) {
            console.error(error);
        } else {
            data.forEach((d, i) => {
                if (d.Response === 'True') {
                    var movie = parsed[i];
                    var sameYear = d.Search.filter((s: any) => +s.Year === movie.date.getFullYear());
                    if (sameYear.length) {
                        movie.searchResults = sameYear;
                    }
                }
            })
        }
        console.log(JSON.stringify(parsed));
    })
}