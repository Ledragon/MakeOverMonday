import * as angular from 'angular';
import * as d3 from 'd3';

import { scores } from '../charts/scores';

var _width = 500;
var _height = 600;

interface IscoresScope extends angular.IScope {
    items: Array<any>;
}

class scoresController {
    items: Array<any>;
    selection: any;
    static $inject = ['$scope', '$http'];
    constructor($scope: IscoresScope, $http: angular.IHttpService) {
        $http.get('mom/36/data/Movies.json')
            .then(data => {
                var d = <any>data.data;
                this.items = d.data;
                scores(this.selection, _width, _height, this.items);
            })
    }
}

class scoresDirective implements angular.IDirective {
    restrict = 'E';
    controller = scoresController;
    controllerAs = 'vm';
    scope = {};
    link($scope: any, element: angular.IAugmentedJQuery, attributes: any, controller: scoresController) {
        var selection = d3.select(element[0]);
        var svg = selection.append('svg')
            .attr('width', _width)
            .attr('height', _height);
        controller.selection = svg;
        if (controller.items) {
            scores(svg, _width, _height, controller.items);
        }
    }
}
export function init(mod:angular.IModule) {
    mod
        .directive('scores', () => new scoresDirective());
}