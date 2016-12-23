import { mom27 } from './component';

var mom27State = {
    name: 'mom27',
    template: '<mom27 class=\"flex-container\"></mom27>',
    url: '/mom27',
    data: {
        description: ''
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom27State);
        })
        .component(mom27.name, mom27.component);
}