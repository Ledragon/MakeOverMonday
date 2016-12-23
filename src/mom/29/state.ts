import { mom29 } from './component';

var mom29State = {
    name: 'mom29',
    template: '<mom29 class=\"flex-container\"></mom29>',
    url: '/mom29',
    data: {
        description: ''
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom29State);
        })
        .component(mom29.name, mom29.component);
}