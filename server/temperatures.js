//change this to mirro the logs, but with only this location
Meteor.publish("temperatures", function (locID) {

  var user = Meteor.users.findOne({_id: this.userId});

  if(!user) {
    return false;
  }

  return Temperatures.find({ locID:locID }, { sort: { createdDay: 1 }  });
});