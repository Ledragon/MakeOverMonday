(function () {
    d3.csv('Female Corporate Talent Pipeline.csv',
        function (d) {
            return {
                year: +d.Year,
                level: d.Level,
                female: +d.Female.replace('%', '') / 100,
                male: +d.Male.replace('%', '') / 100
            }
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                console.log(data);

            }
        })
} ());