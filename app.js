(function () {
    'use strict';
    var width = 750;
    var height = 600;

    var container = d3.select('svg')
        .attr({
            'width': width,
            'height': height
        });
    var submissionsPerWeek = charting.submissionsPerWeek(container, width, height);

    var nd = d3.select('#global')
        .append('svg')
        .attr({
            'width': width,
            'height': height
        });
    var distribution = charting.numberOfSubmissionsDistribution(nd, width, height);

    var statistics = d3.select('#statistics')
        .style('width', '300px')
        .append('div')



    d3.csv('data/Makeover Monday.csv',
        (d) => {
            return {
                pinterestBoard: d['Pinterest Board'],
                pinboardUrl: d['Pinboard URL'],
                imageUrl: d['Image URL'],
                description: d.Description,
                pinNote: d['Pin Note'],
                originalLink: d['Original Link'],
                name: d['Name'],
                week: +d.Week,
                datePinned: moment(d['Date Pinned'], 'DD-MM-YY HH:mm')
            }
        },
        (error, data) => {
            if (error) {
                console.error(error);
            } else {
                submissionsPerWeek.update(data);
                distribution.update(data);

                statistics.append('h2')
                    .text('submissions');
                statistics.append('span')
                    .text(data.length);

                statistics.append('h2')
                    .text('Participants');
                var byName = d3.nest()
                    .key(d => d.name)
                    .entries(data);
                statistics.append('span')
                    .text(byName.length);

                var sorted = byName.map(d => {
                    return {
                        name: d.key,
                        submissions: d.values.length
                    };
                })
                    .sort((a, b) => d3.descending(a.submissions, b.submissions))
                    .splice(0, 20);
                var subWidth = 300;
                var subHeight = 400;
                var svg = d3.select('#statistics').append('svg')
                    .attr({
                        'width': subWidth,
                        height: subHeight
                    });

                submissionsByPerson(svg, sorted, subWidth, subHeight);

                submissionsPerWeek.dispatch.on('clicked', d => {
                    d3.select('#weekNumber').select('h4').text(`Week ${d.key} - ${d.values.length} submissions`)
                    var sorted = d.values.sort((a, b) => d3.ascending(a.name, b.name));
                    var bound = d3.select('#weeks')
                        .selectAll('div')
                        .data(sorted);
                    bound.exit().remove();
                    var enter = bound.enter()
                        .append('div')
                        .classed('miniature', true)
                        .append('a');
                    bound.select('a').attr({
                        'target': '_blank',
                        href: d => d.imageUrl
                    })
                    enter.append('span');
                    bound.select('span').text(d => d.name);

                    enter.append('div')
                        .classed('thumbnail', true)
                    bound.select('.thumbnail')
                        .style('background-image', d => `url("${d.imageUrl}")`)
                    // enter.append('img')
                    //     .classed('thumbnail', true)
                    // bound.select('.thumbnail')
                    //     .attr('src', d => `${d.imageUrl}`)
                })
            }
        });

    function submissionsByPerson(container, data, width, height) {
        var marginTop = 30;
        container
            .append('g')
            .attr('transform', `translate(${width / 2},${20})`)
            .style('text-anchor', 'middle')
            .append('text')
            .text('Top submitters')
            ;
        var group = container.append('g')
            .attr('transform', `translate(${120},${marginTop})`);
        var xScale = d3.scale.linear()
            .domain([0, d3.max(data, d => d.submissions)])
            .range([0, width - 140]);

        var yScale = d3.scale.ordinal()
            .domain(data.map(d => d.name))
            .rangeBands([0, height - marginTop], .5)
        var yAxis = d3.svg.axis()
            .orient('left')
            .scale(yScale);
        var yAxisGroup = group.append('g')
            .classed('axis', true)
            .call(yAxis);
        var rectHeight = yScale.rangeBand()
        var enterSelection = group.selectAll('g.person')
            .data(data)
            .enter()
            .append('g')
            .classed('person', true)
            .attr('transform', d => `translate(${0},${yScale(d.name)})`);
        enterSelection.append('rect')
            .attr({
                x: 0,
                y: 0,
                width: d => xScale(d.submissions),
                height: rectHeight
            })
            .style('fill', '#2ca25f')
        enterSelection.append('text')
            .attr('y', rectHeight)
            .attr('x', d => xScale(d.submissions) - 20)
            .style({
                fill: 'white',
                'font-size': '12px'
            })
            .text(d => d.submissions);
    }
} ());