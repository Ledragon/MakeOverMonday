import * as angular from 'angular';
import * as d3 from '../../d3';

import { chart } from '../charts/adjustedGross';

var _width = 600;
var _height = 800;

interface IadjustedGrossScope extends angular.IScope {
    items: Array<any>;
}

class adjustedGrossController {
    items: Array<any>;
    selection: any;
    static $inject = ['$scope', '$http'];
    constructor($scope: IadjustedGrossScope, $http: angular.IHttpService) {
        $http.get('data/Movies.json')
            .then(data => {
                var d = <any>data.data;
                this.items = d.data;
                chart(this.selection, _width, _height, this.items);
            })
    }
}

class adjustedGrossDirective implements angular.IDirective {
    restrict = 'E';
    controller = adjustedGrossController;
    controllerAs = 'vm';
    scope = {};
    link($scope: any, element: angular.IAugmentedJQuery, attributes: any, controller: adjustedGrossController) {
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
export function init() {

    angular.module('app')
        .directive('adjustedGross', () => new adjustedGrossDirective());
}