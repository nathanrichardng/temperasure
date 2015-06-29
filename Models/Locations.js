Locations = new Mongo.Collection("locations");

Locations.allow({
  insert: function (userId, location) {
    return userId && location.owner === userId;
  },
  update: function (userId, location, fields, modifier) {
    /*if (userId !== location.owner)
      return false;*/

    return true;
  },
  remove: function (userId, location) {
    if (userId !== location.owner)
      return false;

    return true;
  }
});

Locations.after.update(function(userId, doc) {
  if (doc.name != this.previous.name) {
    var logs = Logs.find({locID: doc._id}).fetch();
    for(var i=0; i<logs.length; i++) {
      var log = logs[i];
      Logs.update({_id: log._id }, { $set: {loc: doc} });
    }
  }
});

Locations.after.remove(function(userId, doc) {
  var logs = Logs.find({locID: doc._id}).fetch();
  for(var i=0; i<logs.length; i++) {
    var log = logs[i];
    Logs.update({_id: log._id }, { $set: { removed: true} });
  }
})