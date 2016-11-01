import * as angular from 'angular';

interface IctrlScope extends angular.IScope {
    items: Array<any>;
}

class ctrl {
    items:Array<any>
    static $inject = ['$scope', '$http'];
    constructor($scope: IctrlScope, $http: angular.IHttpService) {
        $http.get('data/Movies.json')
            .then(data => {
                var d = <any>data.data;
                this.items = d.data;
            })
    }

    getStyle(item:any) {
        return {
            'background-image':`url(${item.searchResults.Poster})`
        }
    }
}

class moviesDirective implements angular.IDirective{
    restrict = 'E';
    controller = ctrl;
    controllerAs = 'vm';
    templateUrl = 'app/directives/movies.html';
    
}
export function init(){

    angular.module('app')
        .controller('ctrl', ctrl)
        .directive('movies', () => new moviesDirective());
}