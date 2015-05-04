Temperatures = new Mongo.Collection("temperatures");

Temperatures.allow({
  insert: function (userId, temperature) {
    return true;
  },
  update: function (userId, temperature, fields, modifier) {
    /*if (userId !== temperature.owner)
      return false;*/

    return true;
  },
  remove: function (userId, temperature) {
    if (userId !== temperature.createdBy)
      return false;

    return true;
  }
});