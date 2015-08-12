Meteor.methods({
  checkeveryaor: function() {
    Taskspending.find({tags: "largercontext"}).forEach( function (contextdoc) {
      Taskspending.find({tags: "aor"}).forEach( function (aordoc) {
        var aorprojects = Taskspending.find({aor: aordoc._id}).map( function (projdoc) {
          return projdoc.project
        })
        aorprojects.push(aordoc.project)
console.log(aorprojects)
        if (contextdoc.contextaor.indexOf(aordoc._id) == -1) {
          if (Taskspending.findOne({context: contextdoc.context, project: {$in: aorprojects}})) {
//          console.log("adding")
            Taskspending.update({_id: contextdoc._id}, {$push: {contextaor: aordoc._id}})
          }
        } else {
          if (!Taskspending.findOne({context: contextdoc.context, project: {$in: aorprojects}})) {
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
