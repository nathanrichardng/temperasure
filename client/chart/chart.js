angular
	.module('temperasure.chart', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('chartCtrl', chartCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
chartCtrl.$inject = ['$stateParams', '$meteor', 'dateService', 'locationService', 'tempService', 'logService'];

//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

	$stateProvider
		.state('chart', {
			url: '/chart',
			templateUrl: 'client/chart/chart.ng.html',
			controller: 'chartCtrl',
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

function chartCtrl($stateParams, $meteor, dateService, locationService, tempService, logService) {
	var vm = this;
	vm.message = "";
	vm.startDate = dateService.today();
	vm.endDate = dateService.today();
	vm.getDates = getDates;
	vm.chartData = [];

	activate();

	function activate() {
		getDates();
	}

	function getDates() {
		var dateArray = dateService.datesBetween(vm.startDate, vm.endDate);
		$meteor.call('getChartData', dateArray).then(function(data) {
			console.log(data);
			vm.chartData = data;
			console.log(vm.chartData);
		})
	}
	
}