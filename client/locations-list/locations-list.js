angular
	.module('temperasure.locationsList', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('LocationsListCtrl', LocationsListCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
LocationsListCtrl.$inject = ['$meteor', 'locationService', 'dateService'];


//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

    $stateProvider
      .state('locations', {
        url: '/locations',
        templateUrl: 'client/locations-list/locations-list.ng.html',
        controller: 'LocationsListCtrl',
        controllerAs: 'vm',
        resolve: {
			'currentUser': ['$meteor', function($meteor) {
				return $meteor.requireUser(); //only allow users that are logged in to see this page
			}]
		}
      })
}

//////////////////////////////////////////////////////////////////////////
//             CONTROLLERS
//////////////////////////////////////////////////////////////////////////

function LocationsListCtrl($meteor, locationService, dateService) {
	var vm = this;
	vm.newLocation = locationService.createLocation();
	vm.locations = $meteor.collection(Locations, false).subscribe('locations');
	vm.add = add;
	vm.message = null;

	function add(location) {
		$meteor.requireUser().then(success);
		vm.message = null;

		function success(user) {
			console.log(user);
			if (formOkay()) {
				vm.newLocation.owner = user._id;
				vm.newLocation.createdDate = dateService.now();
				vm.locations.save(vm.newLocation).then(resetLocation);

				function resetLocation() {
					vm.newLocation = locationService.createLocation();
				}
			}
			else {
				vm.message = "One or more fields is filled out incorrectly";
			}
		}
	}

	function formOkay() {
		//refactor to give user more information on what is wrong
		return ( vm.newLocation.name.length > 0 &&
				 vm.newLocation.description.length > 0 &&
				 angular.isNumber(vm.newLocation.min) &&
				 angular.isNumber(vm.newLocation.max) &&
				 vm.newLocation.min < vm.newLocation.max );
	}
}  