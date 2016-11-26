import { select, Selection } from 'd3-selection';
import { csv } from 'd3-request';
import { sum, max } from 'd3-array';
import { nest } from 'd3-collection';
import { scaleLinear, scaleOrdinal, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { dispatch } from 'd3-dispatch';

const width = 480;
const height = 780;
let svg = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 50,
    bottom: 30,
    left: 80,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

let titleGroup = svg.append('g')
    .classed('title', true)
    .attr('transform', `translate(${width / 2},${30})`)
    .append('text')
    .style('text-anchor', 'middle')
    .text('The 50 most used words in the top 100 songs');


let songsGroup = plotGroup.append('g')
    .classed('songs', true);

let wordsChart = drawWords(plotGroup, plotWidth, plotHeight);
wordsChart.on('click', d => console.log(d));

const stopWords = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your'];

csv('data/Top 100 Songs of All Time Lyrics.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        let byWord = groupByWord(data);
        wordsChart.update(byWord);
        // drawSongs(songsGroup, 0, 0, groupBySong(data));
    }
});

function groupByWord(data: Array<any>): Array<any> {
    let byWord = nest()
        .key(d => d['Word'])
        .entries(data)
        .filter(d => stopWords.indexOf(d.key.toLowerCase()) < 0)
        .sort((a, b) => b.values.length - a.values.length);
    console.log(byWord);
    return byWord;
}

function groupBySong(data: Array<any>): Array<any> {
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

function drawWords(container: Selection<any, any, any, any>, width: number, height: number) {
    let group = container.append('g')
        .classed('words', true);
    let xScale = scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    let yScale = scaleBand<any>()
        .range([0, height])
        .padding(0.3);
    let axis = axisLeft(yScale);
    let axisGroup = container.append('g')
        .classed('axis', true)
        .call(axis);

    let _dispatch = dispatch('click');

    function update(data: Array<any>): void {
        let usedData = data.splice(0, 50);
        xScale.domain([0, max(usedData, d => d.values.length)]);
        yScale.domain(usedData.map(d => d.key));
        axisGroup.call(axis);

        var dataBound = group.selectAll('.words')
            .data(usedData);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('words', true)
            .attr('transform', (d, i) => `translate(${0},${yScale(d.key)})`)
            .on('mousedown', function (d) {
                _dispatch.call('click', <any>this, d);
            });
        var rect = enterSelection.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', d => xScale(d.values.length))
            .attr('height', yScale.bandwidth())
            .style('fill', 'lightblue');
        enterSelection.append('text')
            .style('font-size', 10)
            .style('text-anchor', 'middle')
            .attr('transform', d => `translate(${xScale(d.values.length) / 2},${8})`)
            .text(d => d.values.length)

    }
    return {
        update: (data: Array<any>) => update(data),
        on: (eventName: string, callback: (d: any) => void) => {
            _dispatch.on(eventName, callback);
        }
    }
}