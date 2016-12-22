import { mom41 } from './component';

var mom41State = {
    name: 'mom41',
    template: '<mom41 class=\"flex-container\"></mom41>',
    url: '/mom41',
    data: {
        description: 'Satisfaction with Transport in EU Cities'
    }
};
export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom41State);
        })
        .component(mom41.name, mom41.component);
}