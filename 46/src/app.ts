import { csv } from 'd3-request';
import { sum } from 'd3-array';
import { nest } from 'd3-collection';

csv('data/Top 100 Songs of All Time Lyrics.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        let byWord = nest()
            .key(d => d['Word'])
            .entries(data)
            .sort((a, b) => b.values.length - a.values.length);
        console.log(byWord);

        let bySong = nest()
            .key(d => d['Song Title'])
            .entries(data)
            .map(d => {
                return {
                    title: d.key,
                    rank: +d.values[0]['Song Rank'],
                    artist: d.values[0]['Artist'],
                    words: d.values.map(dd => dd.Word),
                    lyrics: d.values.sort((a, b) => a['WordCount'] - b['WordCount']).map(dd => dd.Word).join(' ')
                }
            });
        console.log(bySong);

    }
});