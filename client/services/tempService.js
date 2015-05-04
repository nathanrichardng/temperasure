angular.module("temperasure")
	.factory("tempService", tempService);

tempService.$inject = ['$meteor'];

function tempService($meteor) {

	return {
		createTemp: createTemp
	}


	function createTemp(locID) {
		var newTemp = {
			value: null,
			inRange: null,
			locID: locID,
			createdDate: null,
			createdBy: null 
		}

		return newTemp;
	}
}