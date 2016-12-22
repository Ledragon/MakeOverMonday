export class momHeadingController {
    name: string = 'test';
    description: string = 'desc';
    static $inject = ['$scope'];
    constructor($scope: angular.IScope) {
        $scope.$on('$stateChangeSuccess', (event, toState: angular.ui.IState) => {
            this.name = toState.name.replace('mom', '');
            this.description = toState.data.description;
        });
    }
}

export var momHeading = {
    name: 'momHeading',
    component: {
        templateUrl: 'momHeading/template.html',
        controller: momHeadingController
    }
};