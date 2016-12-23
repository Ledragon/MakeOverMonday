import { mom26 } from './component';

var mom26State = {
    name: 'mom26',
    template: '<mom26 class=\"flex-container\"></mom26>',
    url: '/mom26',
    data: {
        description: 'Makeover Monday Dashboard Design Contest'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom26State);
        })
        .component(mom26.name, mom26.component);
}