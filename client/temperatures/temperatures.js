angular
	.module('temperasure.temperatures', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('TemperaturesCtrl', TemperaturesCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
TemperaturesCtrl.$inject = ['$stateParams', '$meteor', 'dateService', 'locationService', 'tempService', 'logService'];

//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

	$stateProvider
		.state('temperatures', {
			url: '/temperatures/:locationId',
			templateUrl: 'client/temperatures/temperatures.ng.html',
			controller: 'TemperaturesCtrl',
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

function TemperaturesCtrl($stateParams, $meteor, dateService, locationService, tempService, logService) {
	var vm = this;
	var locID = $stateParams.locationId;
	var loc = Locations.findOne({_id: locID});
	vm.message = "";
	vm.newTemp = tempService.createTemp(locID);
	vm.location = $meteor.object(Locations, locID, false);
	vm.logs = $meteor.collection(Logs, false);


	vm.startDate = dateService.now();
	vm.endDate = dateService.now();
	vm.getDates = getDates;
	vm.addTemp = addTemp;

	activate();

	function activate() {

		getDates();
		
	}

	function getDates() {
		vm.message = "";
		if (vm.startDate > vm.endDate) {
			vm.message = "Start date cannot be after end date."
		}
		var dates = dateService.datesBetween(vm.startDate, vm.endDate);
		var params = {locIDs: [locID], locs: [loc], days: dates, sort: { createdDay: 1 } };
		logService.subscribe(params);
	}

	function addTemp() {
		$meteor.requireUser().then(add);

		function add(user) {
			var newTemp = vm.newTemp;
			newTemp.createdDate = dateService.now();
			newTemp.createdBy = user.emails[0].address;
			newTemp.inRange = locationService.inRange(newTemp.value, vm.location);

			var today = Logs.findOne({locID: locID ,createdDay: dateService.today()});
			if (!today){
				today = logService.createLog(loc, dateService.today());
			}

			today.message = "";
			today.temps.push(newTemp);
			today.newestTemp = newTemp;
			vm.logs.save(today);
			vm.newTemp = tempService.createTemp(locID);
		}
	}
}