angular.module('temperasure', [
	'angular-meteor', 
	'ui.router',
	'temperasure.home',
	'temperasure.locationsList',
	'temperasure.locationDetails',
	'temperasure.temperatures',
	'temperasure.todaysLog'
]).config(Config)
  .run(requireAuth);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
requireAuth.$inject = ['$rootScope', '$state'];

//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/home");
}

//////////////////////////////////////////////////////////////////////////
//        Redirect
/////////////////////////////////////////////////////////////////////////

function requireAuth($rootScope, $state) {
	$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
	    // We can catch the error thrown when the $requireUser promise is rejected
	    // and redirect the user back to the main page
	    if (error === "AUTH_REQUIRED") {
	      $state.go('home');
	      console.log('Not authorized, redirecting');
	    }
	});
}