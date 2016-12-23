import { mom36 } from './component';

var mom36State = {
    name: 'mom36',
    template: '<mom36 class=\"flex-container\"></mom36>',
    url: '/mom36',
    data: {
        description: 'An Actor’s Life: Alan Rickman'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom36State);
        })
        .component(mom36.name, mom36.component);
}