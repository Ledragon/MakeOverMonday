import { read } from './services/dataService';

read('data/Alan Rickman.csv', data => {
    console.log(data.columns)
    let parsed: Array<any> = [];
    data.forEach((d: any) => {
        parsed.push({
            date: new Date(d.Date),
            title: d.Title,
            studio: d.Studio,
            adjustedGross: +(d[' Adjusted Gross '].trim().split(',').join('')),
            lifetimeGross: +(d[' Lifetime Gross '].trim().split(',').join('')),
            theatres: +(d['Theatres'].trim().split(',').join('')),
            opening: d['Opening'] ? +(d[' Opening '].trim().split(',').join('')) : null,
            openingTheatres: d['Opening Theatres'] ? +(d['Opening Theatres'].trim().split(',').join('')) : null,
            rank: d['Rank'] ? +(d['Rank'].trim().split(',').join('')) : null,
            cameo: d['Cameo'],
            tomatometerScore: +d['TomatometerScore'],
            audienceScore: +d['AudienceScore'],
        });
    });

    console.log(parsed);

})