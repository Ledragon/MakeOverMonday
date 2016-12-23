import * as angular from 'angular';
import * as d3 from 'd3';

import { chart } from '../charts/theatres';

var _width = 500;
var _height = 600;

interface ItheatresScope extends angular.IScope {
    items: Array<any>;
}

class theatresController {
    items: Array<any>;
    selection: any;
    static $inject = ['$scope', '$http'];
    constructor($scope: ItheatresScope, $http: angular.IHttpService) {
        $http.get('mom/36/data/Movies.json')
            .then(data => {
                var d = <any>data.data;
                this.items = d.data;
                chart(this.selection, _width, _height, this.items);
            })
    }
}

class theatresDirective implements angular.IDirective {
    restrict = 'E';
    controller = theatresController;
    controllerAs = 'vm';
    scope = {};
    link($scope: any, element: angular.IAugmentedJQuery, attributes: any, controller: theatresController) {
        var selection = d3.select(element[0]);
        var svg = selection.append('svg')
            .attr('width', _width)
            .attr('height', _height);
        controller.selection = svg;
        if (controller.items) {
            chart(svg, _width, _height, controller.items);
        }
    }
}
export function init(mod: angular.IModule) {
    mod
        .directive('theatres', () => new theatresDirective());
}