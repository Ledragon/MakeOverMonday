import { mom35 } from './component';

var mom35State = {
    name: 'mom35',
    template: '<mom35 class=\"flex-container\"></mom35>',
    url: '/mom35',
    data: {
        description: 'U.S. Corporate Tax Havens'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom35State);
        })
        .component(mom35.name, mom35.component);
}