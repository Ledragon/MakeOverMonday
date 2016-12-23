import { mom33 } from './component';

var mom33State = {
    name: 'mom33',
    template: '<mom33 class=\"flex-container\"></mom33>',
    url: '/mom33',
    data: {
        description: 'Make-up of UK Beauty'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom33State);
        })
        .component(mom33.name, mom33.component);
}