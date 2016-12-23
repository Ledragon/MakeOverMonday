import { mom28 } from './component';

var mom28State = {
    name: 'mom28',
    template: '<mom28 class=\"flex-container\"></mom28>',
    url: '/mom28',
    data: {
        description: ''
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom28State);
        })
        .component(mom28.name, mom28.component);
}