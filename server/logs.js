//change this so that it only uses one date
Meteor.publish("logs", function (params) {

	var user = Meteor.users.findOne({_id: this.userId});

	if(!user) {
		return false;
	}

	for (var i=0; i<params.locs.length; i++) {
		var loc = params.locs[i];
		updateLogs(loc);
	}

//update params being sent
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
	

	return Logs.find({ 
		$and:[
			{locID: {$in: params.locIDs} },
			{createdDay: {$in: params.days } }
		] 
	}, { sort: params.sort  });
});