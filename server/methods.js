Meteor.methods({
	recordTemp: function(locID, createdDay, temp) {

		Logs.update(
			{"locID": locID, "createdDay": createdDay}, 
			{$addToSet: { temps: temp } }
		);

		DayLogs.update(
			{"locID": locID, "createdDay": createdDay}, 
			{$addToSet: { temps: temp } }
		);

	},

	addMissingDays: function(params) {
		for (var i=0; i<params.locs.length; i++) {
			var loc = params.locs[i];
			updateLogs(loc);
		}

		function updateLogs(loc){
			for(var i=0; i<params.days.length; i++) {
				var day = params.days[i];
				var log = Logs.findOne({locID: loc._id, createdDay: day});
				if (!log){
					Logs.insert({
						locID: loc._id,
						loc: loc, 
						createdDay: day,
						temps: [],
						message: "No temps recorded for this date"
					});
				}
			}
		}
	}
})