System.register(['./bootstrap'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var bootstrap_1;
    return {
        setters:[
            function (bootstrap_1_1) {
                bootstrap_1 = bootstrap_1_1;
            }],
        execute: function() {
            bootstrap_1.bootstrap();
        }
    }
});
// import { select, selectAll } from 'd3-selection/index';
// export class app {
//     constructor() {
//         console.log('hello world');
//         select('body')
//             .append('svg')
//             .attr('width', 800)
//             .attr('height', 800)
//     }
// }
// var appli = new app()
