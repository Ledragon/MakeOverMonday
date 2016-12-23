import { mom32 } from './component';

var mom32State = {
    name: 'mom32',
    template: '<mom32 class=\"flex-container\"></mom32>',
    url: '/mom32',
    data: {
        description: 'All-Time Summer Olympic Medal Standings'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom32State);
        })
        .component(mom32.name, mom32.component);
}