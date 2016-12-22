import { mom39 } from './component';

var mom39State = {
    name: 'mom39',
    template: '<mom39 class=\"flex-container\"></mom39>',
    url: '/mom39',
    data: {
        description: 'Global Peach Index'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom39State);
        })
        .component(mom39.name, mom39.component);
}