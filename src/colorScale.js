"use strict";
var d3_scale_chromatic_1 = require('d3-scale-chromatic');
function color(value) {
    return d3_scale_chromatic_1.schemePastel1[value];
}
exports.color = color;
exports.red = d3_scale_chromatic_1.schemeSet1[0];
exports.green = d3_scale_chromatic_1.schemeSet1[2];
//# sourceMappingURL=colorScale.js.map