//change this so that it only uses one date
Meteor.publish("logs", function () {

	var user = Meteor.users.findOne({_id: this.userId});

	if(!user) {
		return false;
	}	

	return Logs.find();
});