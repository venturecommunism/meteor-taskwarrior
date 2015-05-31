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

Meteor.publish("taskspendingunprocessed", function(unprocessedlimit) {
  var userId = this.userId
  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "inbox"}, {limit: unprocessedlimit})
  }
})

Meteor.publish("taskspendingcalendar", function(calendarlimit) {
  var userId = this.userId
  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: calendarlimit})
  }
})

Meteor.publish("taskspendingmits", function(mitslimit) {
  var userId = this.userId
  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "mit"}, {sort: {rank: 1}, limit: mitslimit})
  }
})

Meteor.publish("taskspendingprojectlesssomedaymaybes", function(projectlesssomedaymaybeslimit) {
  var userId = this.userId
  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "somedaymaybe"})
  }
})
