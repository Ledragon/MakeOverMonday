import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom46 = {
    name: 'mom46',
    component: {
        templateUrl: 'mom/46/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {

    const width = 480;
    const height = 780;
    let plotMargins = {
        top: 50,
        bottom: 30,
        left: 80,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();
    let svg = d3.select('#chart')
        .select('svg');
    let titleGroup = svg.append('g')
        .classed('title', true)
        .attr('transform', `translate(${width / 2},${30})`)
        .append('text')
        .style('text-anchor', 'middle')
        .text('The 50 most used words in the top 100 songs');


    let songsGroup = plotGroup.append('g')
        .classed('songs', true);

    let wordsChart = drawWords(plotGroup, plotWidth, plotHeight);
    wordsChart.on('click', d => {
        let song = d3.select('#song');
        let bySong = groupBySong(d.values);
        console.log(bySong)
        song.select('p')
            .text('Word ' + d.key + ' is used ' + d.values.length + ' times in ' + bySong.length + ' songs');
        let lis = song.select('ul')
            .selectAll('li')
            .data(bySong.sort((a, b) => b.words.length - a.words.length));
        lis.exit().remove();
        lis.enter()
            .append('li')
            .text(d => d.artist + ' - ' + d.title + ': ' + d.words.length);
        lis.text(d => d.artist + ' - ' + d.title + ': ' + d.words.length);
    });

    const stopWords = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your'];

    const fileName = 'mom/46/data/Top 100 Songs of All Time Lyrics.csv';
    csvService.read(fileName, update);

    function update(data: Array<any>) {
        let byWord = groupByWord(data);
        wordsChart.update(byWord);
        // drawSongs(songsGroup, 0, 0, groupBySong(data));
    };

    function groupByWord(data: Array<any>): Array<any> {
        let byWord = d3.nest<any>()
            .key(d => d['Word'])
            .entries(data)
            .filter(d => stopWords.indexOf(d.key.toLowerCase()) < 0)
            .sort((a, b) => b.values.length - a.values.length);
        console.log(byWord);
        return byWord;
    }

    function groupBySong(data: Array<any>): Array<any> {
        let bySong = d3.nest<any>()
            .key(d => d['Song Title'])
            .entries(data)
            .map(d => {
                return {
                    title: d.key,
                    rank: +d.values[0]['Song Rank'],
                    artist: d.values[0]['Artist'],
                    words: d.values.map((dd: any) => dd.Word),
                    lyrics: d.values.sort((a: any, b: any) => a['WordCount'] - b['WordCount'])
                        .map((dd: any) => dd.Word).join(' ')
                }
            })
            .sort((a, b) => a.rank - b.rank);
        return bySong;
    }

    function drawSong(container: d3.Selection<any, any, any, any>, width: number, height: number) {
        var group = container.append('g')
            .classed('song', true);
    }

    function drawWords(container: d3.Selection<any, any, any, any>, width: number, height: number) {
        let group = container.append('g')
            .classed('words', true);
        let xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);
        let yScale = d3.scaleBand<any>()
            .range([0, height])
            .padding(0.3);
        let axis = d3.axisLeft(yScale);
        let axisGroup = container.append('g')
            .classed('axis', true)
            .call(axis);

        let _dispatch = d3.dispatch('click');

        function update(data: Array<any>): void {
            let usedData = data.splice(0, 50);
            xScale.domain([0, d3.max(usedData, d => d.values.length)]);
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
}