Meteor.publish("logs", function (params) {

	var user = Meteor.users.findOne({_id: this.userId});

	if(!user) {
		return false;
	}

	for(var i=0; i<params.days.length; i++) {
		var day = params.days[i];
		var log = Logs.findOne({locID: params.locID, createdDay: day});
		if (!log){
			Logs.insert({
				locID: params.locID, 
				createdDay: day,
				temps: [],
				message: "No temps recorded for this date"
			});
		}
	}

	return Logs.find({ 
		$and:[
			{locID: params.locID},
			{createdDay: {$in: params.days } }
		] 
	}, { sort: { createdDay: 1 }  });
});