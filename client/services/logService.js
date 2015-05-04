angular.module("temperasure")
	.factory("logService", logService);

logService.$inject = ['$meteor'];

function logService($meteor) {

	var subscription = false;

	return {
		createLog: createLog,
		subscribe: subscribe
	}


	function createLog(locID, day) {
		var newLog = {
			locID: locID,
			createdDay: day,
			message: "",
			temps:[] 
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