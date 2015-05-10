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

	vm.startDate = dateService.now();
	vm.endDate = dateService.now();
	var dates = dateService.datesBetween(vm.startDate, vm.endDate);

	vm.message = "";
	vm.newTemp = tempService.createTemp(locID);

	vm.getDates = getDates;
	vm.addTemp = addTemp;

	activate();

	function activate() {
		$meteor.subscribe("locations").then(function() {
			vm.location = $meteor.object(Locations, locID, false);
			getDates();
			vm.logs = $meteor.collection(function() {
				return Logs.find({$and: [ {"locID": locID} , {"createdDay": {$in: dates } } ]}, {sort: { "createdDay": 1 } })
			}).subscribe("logs");
		})
		
		
	}

	function getDates() {
		vm.message = "";
		if (vm.startDate > vm.endDate) {
			vm.message = "Start date cannot be after end date."
		}
		var params = {locIDs: [locID], locs: [loc], days: dates, sort: { createdDay: 1 } };
		$meteor.call("addMissingDays", params);
		dates = dateService.datesBetween(vm.startDate, vm.endDate);
		vm.logs = $meteor.collection(function() {
			return Logs.find({$and: [ {"locID": locID} , {"createdDay": {$in: dates } } ]}, {sort: { "createdDay": 1 } });
		}).subscribe("logs");
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