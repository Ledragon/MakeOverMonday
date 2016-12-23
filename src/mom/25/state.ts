import { mom25 } from './component';

var mom25State = {
    name: 'mom25',
    template: '<mom25 class=\"flex-container\"></mom25>',
    url: '/mom25',
    data: {
        description: 'Theft in Japan'
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom25State);
        })
        .component(mom25.name, mom25.component);
}