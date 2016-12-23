import { mom38 } from './component';

var mom38State = {
    name: 'mom38',
    template: '<mom38 class=\"flex-container\"></mom38>',
    url: '/mom38',
    data: {
        description: 'World’s Biggest Data Breaches'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom38State);
        })
        .component(mom38.name, mom38.component);
}