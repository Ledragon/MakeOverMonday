(function () {
    'use strict';
    var chart = d3.chart(d3.select('#container'),850, 600);

    d3.csv('Theft in Japan.csv',
        function (d) {
            return {
                type: d['Theft Type'],
                category: d['Category'],
                percentage: +d['% of Total'].replace('%', '') / 100,
               crimes:+d['Crimes']
            }
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                chart.update(data.sort((a, b) => b.percentage - a.percentage))
                
            }
        })
} ());