angular
	.module('temperasure')
	.factory('dateService', dateService);

function dateService() {
	return {
		now: now,
		today: today,
		datesBetween: datesBetween
	}

	function now() {
		return new Date();
	}

	function today() {
		var today = new Date();
		today.setHours(0,0,0,0);
		return today;
	}

	function datesBetween(startDate, endDate) {
		var end = new Date(endDate);
		var start = new Date(startDate);
		//do math on dates level
		end.setHours(0,0,0,0);
		start.setHours(0,0,0,0);
		var dates = [];

		for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
			dates.push(new Date(d));
		}

		return dates;
	}
}