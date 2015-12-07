function adminUser(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && userId === adminUser._id);
}

Tasks.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    for(var i=0; i<docs.length; i++ ){
      if ( docs[i].owner != userId || !adminUser(userId)) {
        return false;
      }
    }
             
    return true;
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      for(var i=0; i<docs.length; i++ ){
        if ( docs[i].owner != userId || !adminUser(userId)) {
          return false;
        }
      }

      return true;
    });
  }
});

Taskspending.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    return _.all(docs, function(doc) {
      for(var i=0; i<docs.length; i++ ){
        if ( docs[i].owner != userId || !adminUser(userId)) {
          return false;
        }
      }

      return true;
    });
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      for(var i=0; i<docs.length; i++ ){
        if ( docs[i].owner != userId || !adminUser(userId)) {
          return false;
        }
      }

      return true;
    });
  }
});

Tasksbacklog.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    return _.all(docs, function(doc) {
      for(var i=0; i<docs.length; i++ ){
        if ( docs[i].owner != userId || !adminUser(userId)) {
          return false;
        }
      }

      return true;
    });
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      for(var i=0; i<docs.length; i++ ){
        if ( docs[i].owner != userId || !adminUser(userId)) {
          return false;
        }
      }

      return true;
    });
  }
});

Meteor.publish("scrollpos", function () {
  var userId = this.userId
  return Taskspending.find({type: "scrollpos", owner: this.userId})
})


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

Meteor.publish("taskspendingdotasks", function() {
  var userId = this.userId
  if(adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, energylevel: Session.get("energylevel")}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, owner: userId, energylevel: {$exists: 1}})
  }
})

Meteor.publish("taskspendinglowestranked", function() {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({rank: {$exists: 1}}, {sort: {rank: 1}, limit: 1})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, rank: {$exists: 1}}, {sort: {rank: 1}, limit: 1})
  }
})

Meteor.publish("taskspendingunprocessed", function(unprocessedlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({tags: "inbox"}, {sort: {rank: 1}, limit: unprocessedlimit})
  }
  else if (userId) {
    return Taskspending.find({tags: "inbox", owner: userId}, {sort: {rank: 1}, limit: unprocessedlimit})
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

Meteor.publish("taskspendingchecklistitems", function() {
  var userId = this.userId
  if (adminUser(userId)) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, energylevel: {$exists: 0}, tags: "checklistitem"}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, status: {$in: ["waiting", "pending"]}, energylevel: {$exists: 0}, tags: "checklistitem"}, {sort: {rank: 1}})
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

Meteor.publish("taskspendingmultitasks2", function(context, aorprojects) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({project: {$in: aorprojects}, status: {$in: ["waiting", "pending"]}, context: context, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({project: {$in: aorprojects}, owner: userId, status: {$in: ["waiting", "pending"]}, context: context, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {rank: 1}})
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

Meteor.publish("taskspendingnavigation", function(navigationlimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({context: "navigation", tags: {$ne: "largercontext"}}, {limit: navigationlimit})
  }
  else if (userId) {
    return Taskspending.find({context: "navigation", tags: {$ne: "largercontext"}}, {limit: navigationlimit})
  }
})

Meteor.publish("taskspendingwips", function(wipslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({wip: {$in: ["projwip", "contwip"]}}, {sort: {rank: 1}})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, wip: {$in: ["projwip", "contwip"]}}, {sort: {rank: 1}})
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
    return Taskspending.find({context: "readandreview", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: readandreviewlimit})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, context: "readandreview", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: readandreviewlimit})
  }
})

Meteor.publish("taskspendingwaitingfors", function(waitingforslimit) {
  var userId = this.userId
//  Meteor._sleepForMs(2000)
  if (adminUser(userId)) {
    return Taskspending.find({context: "waitingfor", tags: {$ne: "largercontext"}}, {limit: waitingforslimit})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, context: "waitingfor", tags: {$ne: "largercontext"}}, {limit: waitingforslimit})
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
  } else if (userId) {
    return Taskspending.find({owner: userId, type: "textfile"})
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
    return Taskspending.find({context: "somedaymaybe", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: projectlesssomedaymaybeslimit})
  }
  else if (userId) {
    return Taskspending.find({owner: userId, context: "somedaymaybe", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: projectlesssomedaymaybeslimit})
  }
})

Meteor.publish('taskspendingcount', function () {
  Counts.publish(this, 'taskspendingcount', Taskspending.find())
})

Meteor.publish('inboxcount', function () {
  Counts.publish(this, 'inboxcount', Taskspending.find({tags: "inbox"}))
})

Meteor.publish('calendarcount', function () {
  Counts.publish(this, 'calendarcount', Taskspending.find({due: {$exists: 1}, tags: {$ne: "inbox"}}))
})

Meteor.publish('projectlesscalendarcount', function () {
  Counts.publish(this, 'projectlesscalendarcount', Taskspending.find({due: {$exists: 1}, project: {$exists: 0}, tags: {$ne: "inbox"}}))
})

Meteor.publish('contextlesscalendarcount', function () {
  Counts.publish(this, 'contextlesscalendarcount', Taskspending.find({due: {$exists: 1}, context: {$exists: 0}, tags: {$ne: "inbox"}}))
})

Meteor.publish('projectlesscontextlesscalendarcount', function () {
  Counts.publish(this, 'projectlesscontextlesscalendarcount', Taskspending.find({due: {$exists: 1}, project: {$exists: 0}, context: {$exists: 0}, tags: {$ne: "inbox"}}))
})

Meteor.publish('hasbothcontandprojcount', function () {
  Counts.publish(this, 'hasbothcontandprojcount', Taskspending.find({context: {$exists: 1}, project: {$exists: 1}}))
})

Meteor.publish('hascontnotprojcount', function () {
  Counts.publish(this, 'hascontnotprojcount', Taskspending.find({context: {$exists: 1}, project: {$exists: 0}}))
})

Meteor.publish('hasprojnotcontcount', function () {
  Counts.publish(this, 'hasprojnotcontcount', Taskspending.find({context: {$exists: 0}, project: {$exists: 1}}))
})

