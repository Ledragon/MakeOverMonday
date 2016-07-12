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
