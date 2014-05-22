function adminUser(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && userId === adminUser._id);
}

Tasks.allow({
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

Taskspending.allow({
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

Tasksbacklog.allow({
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


Meteor.publish("tasks", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Tasks.find()
  }
});

Meteor.publish("taskspending", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Taskspending.find()
  }
});

Meteor.publish("tasksbacklog", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Tasksbacklog.find()
  }
});
