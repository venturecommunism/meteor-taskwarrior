Alltasks = Taskspending.find({context: {$exists: 1}, project: {$exists: 1}})
Alltasks.observe({
  added: function (document) {
    var contextid = Taskspending.findOne({context: document.context, tags: "largercontext"}) ? Taskspending.findOne({context: document.context, tags: "largercontext"})._id : ''
    var projaorid = Taskspending.findOne({project: document.project, aor: {$exists: 1}}) ? Taskspending.findOne({project: document.project, aor: {$exists: 1}}).aor : ''
    if (projaorid == '' || contextid == '' || !Taskspending.findOne({_id: contextid, contextaor: projaorid})) {
      Taskspending.update({_id: contextid}, {$push: {contextaor: projaorid}})
    }
  },
  changed: function (newDocument, oldDocument) {
    if ((newDocument.context != oldDocument.context) || (newDocument.project != oldDocument.project)) {
      var projaorid = Taskspending.findOne({project: oldDocument.project, aor: {$exists: 1}}).aor
      var aorprojects = Taskspending.find({aor: projaorid}).map( function (projdoc) {
        return projdoc.project
      })
      aorprojects.push(Taskspending.findOne({_id: projaorid}).project)
      if (!Taskspending.findOne({project: {$in: aorprojects}, context: oldDocument.context})) {
        var contextid = Taskspending.findOne({context: oldDocument.context, tags: "largercontext"})._id
        Taskspending.update({_id: contextid}, {$pull: {contextaor: projaorid}})
      }
      var contextid = Taskspending.findOne({context: newDocument.context, tags: "largercontext"})._id
      var projaorid = Taskspending.findOne({project: newDocument.project, aor: {$exists: 1}}).aor
      if (!Taskspending.findOne({_id: contextid, contextaor: projaorid})) {
        Taskspending.update({_id: contextid}, {$push: {contextaor: projaorid}})
      }
    }
  },
  removed: function (document) {
    var projaorid = Taskspending.findOne({project: document.project, aor: {$exists: 1}}).aor
    var aorprojects = Taskspending.find({aor: projaorid}).map( function (projdoc) {
      return projdoc.project
    })
    aorprojects.push(Taskspending.findOne({_id: projaorid}).project)
    if (!Taskspending.findOne({project: {$in: aorprojects}, context: document.context})) {
      var contextid = Taskspending.findOne({context: document.context, tags: "largercontext"})._id
      Taskspending.update({_id: contextid}, {$pull: {contextaor: projaorid}})
    }
  },
})

Meteor.methods({
  checkeveryaor: function() {
//find the contexts
    Taskspending.find({tags: "largercontext"}).forEach( function (contextdoc) {
//for every context, find every aor
      Taskspending.find({tags: "aor"}).forEach( function (aordoc) {
//in each context, for every aor
        var aorprojects = Taskspending.find({aor: aordoc._id}).map( function (projdoc) {
//for every project that has that aor
          return projdoc.project
        })
//add the aor itself to variable aorprojects
        aorprojects.push(aordoc.project)
console.log(aorprojects)
//if the aor is not in the contextaor of the context
        if (contextdoc.contextaor.indexOf(aordoc._id) == -1) {
//if find a task with that context where the project is in variable aorprojects
          if (Taskspending.findOne({context: contextdoc.context, project: {$in: aorprojects}})) {
//          console.log("adding")
//then add the aor to the contextaors of that context
            Taskspending.update({_id: contextdoc._id}, {$push: {contextaor: aordoc._id}})
          }
        } else {
//and if you don't find a task with the context where the project is in variable aorprojects
          if (!Taskspending.findOne({context: contextdoc.context, project: {$in: aorprojects}})) {
//then remove the aor from the contextaors of that context
            Taskspending.update({_id: contextdoc._id}, {$pull: {contextaor: aordoc._id}})
          }
        }
      })
    })
  },
})


/*
      Taskspending.find({tags: "largeroutcome"}).forEach( function (projdoc) {
        var specifictask = Taskspending.findOne({context: contextdoc.context, project: projdoc.project})
        if (specifictask) {
          if (!projdoc.aor) {
            projdoc.aor = projdoc._id
          }
          if (!contextdoc.contextaor) {
            Taskspending.update({_id: contextdoc._id}, {$push: {contextaor: projdoc.aor}})
          } else if (contextdoc.contextaor.indexOf(projdoc.aor) == -1) {
            Taskspending.update({_id: contextdoc._id}, {$push: {contextaor: projdoc.aor}})
console.log("added " + projdoc.project + " to " + contextdoc.context)
          }
        } else {
          if (!projdoc.aor) {
            projdoc.aor = projdoc._id
          }
          if (contextdoc.contextaor && contextdoc.contextaor.indexOf(projdoc.aor) > -1) {
            Taskspending.update({_id: contextdoc._id}, {$pull: {contextaor: projdoc.aor}})
console.log("removed " + projdoc.project + " from " + contextdoc.context)
          }
        }
      })
    })
  },
})
*/
