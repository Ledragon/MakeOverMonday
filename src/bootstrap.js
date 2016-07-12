System.register(['d3-selection'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var d3_selection_1;
    function bootstrap() {
        d3_selection_1.select('#container')
            .append('div')
            .text('hello world');
    }
    exports_1("bootstrap", bootstrap);
    return {
        setters:[
            function (d3_selection_1_1) {
                d3_selection_1 = d3_selection_1_1;
            }],
        execute: function() {
        }
    }
});
