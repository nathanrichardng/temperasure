angular
	.module('temperasure.temperatures', ['angular-meteor', 'ui.router'])
	.config(Config)
	.controller('TemperaturesCtrl', TemperaturesCtrl);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
TemperaturesCtrl.$inject = ['$stateParams', '$meteor', 'dateService', 'locationService', 'tempService', 'logService', 'messageService'];

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

function TemperaturesCtrl($stateParams, $meteor, dateService, locationService, tempService, logService, messageService) {
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
	vm.addMessage = addMessage;

	activate();

	function activate() {
		$meteor.subscribe("locations").then(function() {
			vm.location = $meteor.object(Locations, locID, false);
			getDates();
		})
		
		
	}

	function getDates() {
		vm.newMessage = messageService.createMessage();
		//validate date range
		if (vm.startDate > vm.endDate) {
			vm.message = "Start date cannot be after end date."
		}
		//get dates and add missing days on server.
		dates = dateService.datesBetween(vm.startDate, vm.endDate);
		var params = {locIDs: [locID], locs: [loc], days: dates, sort: { createdDay: 1 } };
		$meteor.call("addMissingDays", params).then(function() {
			vm.logs = $meteor.collection(function() {
				return Logs.find({$and: [ {"locID": locID} , {"createdDay": {$in: dates } } ]}, {sort: { "createdDay": 1 } });
			}, false).subscribe("logs");
		});
		
	}

	function addTemp() {
		$meteor.requireUser().then(add);

		function add(user) {

			var newTemp = vm.newTemp;

			if(!tempValid(newTemp)) {
				return false;
			}

			newTemp.createdDate = dateService.now();
			newTemp.createdBy = user.emails[0].address;
			newTemp.inRange = locationService.inRange(newTemp.value, vm.location);

			var today = Logs.findOne({locID: locID, createdDay: dateService.today()});
			if (!today){
				today = logService.createLog(loc, dateService.today());
			}

			today.temps.push(newTemp);
			today.newestTemp = newTemp;
			vm.logs.save(today);
			vm.newTemp = tempService.createTemp(locID);
		}
	}

	function addMessage(date, text) {

		if (text.split("").length < 1)
			return false;

		$meteor.requireUser().then(add);

		function add(user) {
			var newMessage = messageService.createMessage();

			newMessage.text = text;
			newMessage.createdDate = dateService.now();
			newMessage.createdBy = user.emails[0].address;

			var today = Logs.findOne({locID: locID, createdDay: date});
			if (!today){
				today = logService.createLog(loc, dateService.today());
			}

			//reset the value of our input box
			/*today.newMessage.text = "";
			console.log(today);*/

			today.messages.push(newMessage);
			today.newestMessage = newMessage;
			vm.logs.save(today);
			vm.newMessage = messageService.createMessage();
		}
	}



	function tempValid(temp) {
		return (angular.isNumber(temp.value));
	}
}