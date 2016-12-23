import { mom37 } from './component';

var mom37State = {
    name: 'mom37',
    template: '<mom37 class=\"flex-container\"></mom37>',
    url: '/mom37',
    data: {
        description: 'Top 20 Container Shipping Companies '
    }
};


export function register(module: angular.IModule) {
    module
        .config(($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider.state(mom37State);
        })
        .component(mom37.name, mom37.component);
}