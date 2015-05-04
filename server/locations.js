Meteor.publish("locations", function () {

  var user = Meteor.users.findOne({_id: this.userId});

  if(!user) {
    return false;
  }

  var email = user.emails[0].address;

  return Locations.find({
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and:[
        {users: email},
        {users: {$exists: true}}
      ]}
    ]});
});