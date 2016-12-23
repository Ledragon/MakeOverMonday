import { mom30 } from './component';

var mom30State = {
    name: 'mom30',
    template: '<mom30 class=\"flex-container\"></mom30>',
    url: '/mom30',
    data: {
        description: 'Bermuda Census'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom30State);
        })
        .component(mom30.name, mom30.component);
}