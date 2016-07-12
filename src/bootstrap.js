System.register(['d3-selection/index'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1;
    function bootstrap() {
        index_1.select('body')
            .append('div')
            .text('hello world');
    }
    exports_1("bootstrap", bootstrap);
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
        }
    }
});
