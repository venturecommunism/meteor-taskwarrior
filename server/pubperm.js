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

/*
Meteor.publish("tasksbacklog", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Tasksbacklog.find()
  }
});
*/

Meteor.publish("taskspendingunprocessed", function(unprocessedlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "inbox"}, {limit: unprocessedlimit})
  }
  else if (userId) {
    return Taskspending.find({tags: "inbox", owner: userId}, {limit: unprocessedlimit})
  }
})

Meteor.publish("tasksbacklogpreviouscalendar", function(previouscalendarlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Tasksbacklog.find({status: "completed", $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: -1}, limit: previouscalendarlimit})
  }
  else if (userId) {
    return Tasksbacklog.find({owner: userId, status: "completed", $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: -1}, limit: previouscalendarlimit})
  }
})

Meteor.publish("taskspendingcalendar", function(calendarlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: calendarlimit})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: calendarlimit})
  }
})

Meteor.publish("taskspendingcontextpicker", function(contextpickerlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "largercontext"}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, tags: "largercontext"}, {sort: {rank: 1}})
  }
})

Meteor.publish("taskspendingmultitasks", function(context) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, context: context, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, status: {$in: ["waiting", "pending"]}, context: context, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {rank: 1}})
  }
})

Meteor.publish("taskspendingmultitasks2", function(context) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, context: context, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, status: {$in: ["waiting", "pending"]}, context: context, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {rank: 1}})
  }
})


Meteor.publish("taskspendinginactivecontextpicker", function(inactivecontextpickerlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "somedaymaybecont"}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, tags: "somedaymaybecont"}, {sort: {rank: 1}})
  }
})

Meteor.publish("taskspendingmits", function(mitslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "mit"}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, tags: "mit"}, {sort: {rank: 1}})
  }
})

Meteor.publish("taskspendingreadandreview", function(readandreviewlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({context: "readandreview", tags: {$ne: "largercontext"}}, {limit: readandreviewlimit})
  }
  else if (userId) {
    return Taskspending.find({context: "readandreview", tags: {$ne: "largercontext"}}, {limit: readandreviewlimit})
  }
})

Meteor.publish("taskspendingwaitingfors", function(waitingforslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({context: "waitingfor", tags: {$ne: "largercontext"}}, {limit: waitingforslimit})
  }
  else if (userId) {
    return Taskspending.find({context: "waitingfor", tags: {$ne: "largercontext"}}, {limit: waitingforslimit})
  }
})

Meteor.publish("taskspendingprojects", function(projectslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$ne: "somedaymaybeproj"}}]}, {sort: {rank: 1}, limit: projectslimit})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, $and: [{tags: "largeroutcome"}, {tags: {$ne: "somedaymaybeproj"}}]}, {sort: {rank: 1}, limit: projectslimit})
  }
})

Meteor.publish("taskspendingopenproject", function(project) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, status: {$in: ["waiting", "pending"]}, project: project, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}})
  }
})


Meteor.publish("taskspendingdocuments", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Taskspending.find({type: "textfile"})
  }
});


Meteor.publish("taskspendingsomedaymaybeprojects", function(somedaymaybeprojectslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "somedaymaybeproj"}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, tags: "somedaymaybeproj"}, {sort: {rank: 1}})
  }
})



Meteor.publish("taskspendingprojectlesssomedaymaybes", function(projectlesssomedaymaybeslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({context: "somedaymaybe", tags: {$ne: "largercontext"}}, {limit: projectlesssomedaymaybeslimit})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, context: "somedaymaybe", tags: {$ne: "largercontext"}}, {limit: projectlesssomedaymaybeslimit})
  }
})
