import { mom31 } from './component';

var mom31State = {
    name: 'mom31',
    template: '<mom31 class=\"flex-container\"></mom31>',
    url: '/mom31',
    data: {
        description: ''
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom31State);
        })
        .component(mom31.name, mom31.component);
}