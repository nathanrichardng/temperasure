Meteor.methods({
	
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
						messages: []
					});
				}
			}
		}
	},

	//change this to work on the client side instead
	getChartData: function(dayArray) {

		//need to refactor and figure out why todays-log not updating when loc deleted

		var user = Meteor.users.findOne({_id: this.userId});

		if(!user) {
			return false;
		}

		var email = user.emails[0].address;

		var locations = Locations.find({
		    $or:[
		      {$and:[
		        {owner: this.userId},
		        {owner: {$exists: true}}
		      ]},
		      {$and:[
		        {users: email},
		        {users: {$exists: true}}
		      ]}
		    ]}).fetch();

		var chartData = [];
		var x = ['x'];
		//fill x with all the dates
		for (var i=0; i<dayArray.length; i++) {
			x.push(dayArray[i]);
		}
		//add x to chartData
		chartData.push(x);
		//fill each location, then insert it into chartData

		for (var j=0; j<locations.length; j++) {
			var location = locations[j];
			var locTemps = addLocTemps(location);
			chartData.push(locTemps);
		}

		return chartData;

		function addLocTemps(loc) {
			var locArray = [];
			locArray.push(loc.name);
			var locID = loc._id;
			for(var k=0; k<dayArray.length; k++) {
				var day = dayArray[k];
				var log = Logs.findOne({"locID": locID, "createdDay": day});
				if (!log) {
					log = {temps: []};
				}
				if (log.temps.length == 0) {
					log.newestTemp = {value: null};
				}
				var newestTemp = log.newestTemp.value;

				locArray.push(newestTemp);
			}
			return locArray;
		}
	}
})