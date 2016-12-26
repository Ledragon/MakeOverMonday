import { mom52 } from './component';

var mom52State = {
    name: 'mom52',
    template: '<mom52 class=\"flex-container\"></mom52>',
    url: '/mom52',
    data: {
        description: ''
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom52State);
        })
        .component(mom52.name, mom52.component);
}