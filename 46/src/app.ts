import { select } from 'd3-selection';
import { csv } from 'd3-request';
import { sum } from 'd3-array';
import { nest } from 'd3-collection';
const width = 960;
const height = 780;
let svg = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

let songsGroup = plotGroup.append('g')
    .classed('songs', true);

csv('data/Top 100 Songs of All Time Lyrics.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        // let byWord = nest()
        //     .key(d => d['Word'])
        //     .entries(data)
        //     .sort((a, b) => b.values.length - a.values.length);
        // console.log(byWord);

       
        drawSongs(songsGroup, 0, 0, groupBySong(data));
    }
});

function groupBySong(data: Array<any>): Array<any>{
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
            })
        .sort((a, b) => a.rank - b.rank);
     return bySong;
}

function drawSongs(container, width, height, data) {
    var bySong = data;
    var dataBound = container.selectAll('.song')
            .data(bySong);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('song', true)
            .attr('transform', (d, i) => `translate(${0},${i * 20})`)
            .on('mousedown', d => { });
        enterSelection.append('text')
            .text(d => `${d.rank}. ${d.artist} - ${d.title}`);
}