"use strict";
var d3_scale_chromatic_1 = require('d3-scale-chromatic');
var d3_scale_1 = require('d3-scale');
function blueScale() {
    return d3_scale_1.scaleSequential(d3_scale_chromatic_1.interpolateBlues);
}
exports.blueScale = blueScale;
function redScale() {
    return d3_scale_1.scaleSequential(d3_scale_chromatic_1.interpolateReds);
}
exports.redScale = redScale;
//# sourceMappingURL=colorScale.js.map