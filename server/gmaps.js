function adminUser(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && userId === adminUser._id);
}


  Meteor.startup(function () {
    // Publicaciones
    Meteor.publish('Coords', function () {
      return Coords.find();
    });

    return Meteor.methods({
      removeAllCoords: function () {
        return Coords.remove({});
      }
    });
  });

Coords.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    return _.all(docs, function(doc) {
      return (adminUser (userId) || doc.owner === userId);
    });
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      return (adminUser (userId) || doc.owner === userId);
    });
  }
});

