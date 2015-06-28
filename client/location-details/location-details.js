angular
	.module('temperasure.locationDetails', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('LocationDetailsCtrl', LocationDetailsCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
LocationDetailsCtrl.$inject = ['$stateParams', '$state', '$meteor', 'dateService'];

//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

	$stateProvider
		.state('locationDetails', {
			url: '/locations/:locationId',
			templateUrl: 'client/location-details/location-details.ng.html',
			controller: 'LocationDetailsCtrl',
			controllerAs: 'vm',
			resolve: {
				'currentUser': ['$meteor', function($meteor) {
					return $meteor.requireUser(); //only allow users that are logged in to see this page
				}]
			}
		});

}



//////////////////////////////////////////////////////////////////////////
//             CONTROLLERS
//////////////////////////////////////////////////////////////////////////

function LocationDetailsCtrl($stateParams, $state, $meteor) {
	var vm = this;

	vm.message = "";
	vm.newUser = null;
	vm.location = $meteor.object(Locations, $stateParams.locationId, false);
	
	vm.save = save;
	vm.reset = reset;
	vm.addUser = addUser;
	vm.removeUser = removeUser;
	vm.removeLocation = removeLocation;

	activate();

	/////////////////////////////////////////////////////////////////////

	function activate() {
		console.log(vm.location.users);
	}

	function save() {
		vm.location.save().then(success, error);

		function success(numberOfDocs) {
			console.log('save success doc affected ', numberOfDocs);
			vm.message = "Saved changes."
		}
		function error(error) {
			console.log('save error', error);
		}
	}

	function reset() {
		vm.location.reset();
	}

	function addUser(email) {
		vm.location.users.push(email);
		vm.location.save();
		vm.newUser = "";
	}

	function removeUser(email) {
		var index = vm.location.users.indexOf(email);
		console.log(email);
		vm.location.users.splice(index, 1);
		vm.location.save();
	}

	function removeLocation(location) {
		$meteor.collection(Locations).remove(location);
		//workaround to get rid of modal error
		var ModalOpen = angular.element( document.querySelector( '.modal-open' ) );
		ModalOpen.removeClass('modal-open');
		$state.go('locations');
		//create message service to show messages like "location deleted";
	}
}