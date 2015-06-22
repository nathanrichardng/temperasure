//change this so that it only uses one date
Meteor.publish("logs", function () {

	var user = Meteor.users.findOne({_id: this.userId});

	if(!user) {
		return false;
	}	


	//make sure only locations that the user has acess to are published
	var email = user.emails[0].address;
	var locs = Locations.find({
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
	var locIDs = [];

	for (var i=0; i<locs.length; i++) {
		locIDs.push(locs[i]._id);
	}

	return Logs.find({locID: {$in: locIDs}});
});