angular
	.module('temperasure.todaysLog', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('todaysLogCtrl', todaysLogCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
todaysLogCtrl.$inject = ['$stateParams', '$meteor', 'dateService', 'locationService', 'tempService', 'logService'];

//////////////////////////////////////////////////////////////////////////
//         Config
//////////////////////////////////////////////////////////////////////////

function Config($urlRouterProvider, $stateProvider, $locationProvider) {

	$stateProvider
		.state('todays-log', {
			url: '/todays-log',
			templateUrl: 'client/todays-log/todays-log.ng.html',
			controller: 'todaysLogCtrl',
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

function todaysLogCtrl($stateParams, $meteor, dateService, locationService, tempService, logService) {
	var vm = this;
	vm.message = "";
	vm.logs = $meteor.collection(Logs, false);
	vm.addTemp = addTemp;

	activate();

	function activate() {
		$meteor.subscribe("locations").then(function() {
			vm.locations = $meteor.collection(Locations);
			getDates();
		})
	}

	function getDates() {
		vm.message = "";
		var dates = [dateService.today()];
		var locs = [];
		var locIDs = [];
		for(var i = 0; i<vm.locations.length; i++) {
			var loc = vm.locations[i];
			locs.push(loc);
			locIDs.push(loc._id);
			console.log("triggered");
		}
		var params = {locIDs: locIDs, locs: locs, days: dates, sort: { "loc.name": 1 } };
		console.log(params);
		logService.subscribe(params);
	}

	function addTemp(value, loc) {
		$meteor.requireUser().then(add);

		function add(user) {
			var newTemp = tempService.createTemp(loc._id);
			newTemp.value = value;
			newTemp.createdDate = dateService.now();
			newTemp.createdBy = user.emails[0].address;
			newTemp.inRange = locationService.inRange(newTemp.value, loc); //need to somehow include location info here.

			var today = Logs.findOne({locID: loc._id ,createdDay: dateService.today()});
			/*if (!today){
				today = logService.createLog(locID, dateService.today());
			}*/

			today.message = "";
			today.temps.push(newTemp);
			today.newestTemp = newTemp;
			vm.logs.save(today);
		}
	}
}