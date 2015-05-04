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