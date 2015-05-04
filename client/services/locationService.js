angular
	.module('temperasure')
	.factory('locationService', locationService);

function locationService() {

	return {
		createLocation: createLocation,
		inRange: inRange
	}

	function createLocation() {

		var newLocation = {
			name: "",
			description: "",
			min: null,
			max: null,
			users: [],
			createdDate: null
		}

		return newLocation;
	}

	function inRange(temp, location) {
		return (temp >= location.min && temp <= location.max) ? 'YES' : 'NO';
	}
}