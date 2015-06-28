angular
	.module('temperasure.grid', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('gridCtrl', gridCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
gridCtrl.$inject = ['$stateParams', '$meteor', 'dateService', 'locationService', 'tempService', 'logService'];

//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

	$stateProvider
		.state('grid', {
			url: '/grid',
			templateUrl: 'client/grid/grid.ng.html',
			controller: 'gridCtrl',
			controllerAs: 'vm',
			resolve: {
				'currentUser': ['$meteor', function($meteor) {
					return $meteor.requireUser(); //only allow users that are logged in to see this page
				}]
			}
		});

}

//////////////////////////////////////////////////////////////////////////
//             CONTROLLER
//////////////////////////////////////////////////////////////////////////

function gridCtrl($stateParams, $meteor, dateService, locationService, tempService, logService) {
	var vm = this;
	vm.message = "";
	vm.startDate = dateService.today();
	vm.endDate = dateService.today();
	vm.getDates = getDates;
	vm.gridData = [];

	activate();

	function activate() {
		getDates();
	}

	function getDates() {
		var dateArray = dateService.datesBetween(vm.startDate, vm.endDate);
		$meteor.call('getGridData', dateArray).then(function(data) {
			console.log(data);
			vm.gridData = data;
			console.log(vm.gridData);
		})
	}
	
}