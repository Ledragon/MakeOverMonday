(function () {
    var width = 800;
    var height = 450;
    d3.csv('History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            histogram('histogram', width, height, data);
            map('map', width, height, data);
        }
    });
}());