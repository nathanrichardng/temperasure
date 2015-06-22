angular.module("temperasure")
	.factory("logService", logService);

logService.$inject = ['$meteor', 'tempService', 'messageService'];

function logService($meteor, tempService, messageService) {

	var subscription = false;

	return {
		createLog: createLog,
		subscribe: subscribe
	}


	function createLog(loc, day) {

		var newLog = {
			loc: loc,
			createdDay: day,
			messages: [],
			temps:[],
			newestMessage: { text: "", createdDate: null, createdBy: null},
			newestTemp: { value: null, inRange: 'NO' }
		}

		return newLog;
	}

	function subscribe(params) {
		if(subscription){
			subscription.stop();
		}
		$meteor.subscribe('logs', params).then(function(newHandle) {
			subscription = newHandle;
		});
	}


}