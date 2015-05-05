angular.module("temperasure")
	.factory("logService", logService);

logService.$inject = ['$meteor', 'tempService'];

function logService($meteor, tempService) {

	var subscription = false;

	return {
		createLog: createLog,
		subscribe: subscribe
	}


	function createLog(loc, day) {

		var newLog = {
			loc: loc,
			createdDay: day,
			message: "",
			temps:[],
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