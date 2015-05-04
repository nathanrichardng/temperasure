angular
	.module('temperasure.home', ['angular-meteor', 'ui.router'])
	.config(Config);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];


//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'client/home/home.ng.html'
      })
}