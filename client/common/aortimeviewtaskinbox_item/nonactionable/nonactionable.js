Template.nonactionable.events({
  'click .trash': function() {
    trashtask = Taskspending.findOne({_id: this._id})
    trashtask.status = 'completed'
    var i = trashtask.tags.indexOf("inbox")
    if(i != -1) {
      trashtask.tags.splice(i, 1)
    }
    var i = trashtask.tags.indexOf("aorinbox")
    if(i != -1) {
      trashtask.tags.splice(i, 1)
    }
    if (trashtask.tags.length == 0) {
      delete trashtask.tags
    }
    var id = trashtask._id
    delete trashtask._id
    Tasksbacklog.insert(trashtask)
    Taskspending.remove({_id: id})
  },
  'click .archive': function () {
    archivetask = Taskspending.findOne({_id: this._id})
    var i = archivetask.tags.indexOf("inbox")
    if(i != -1) {
      archivetask.tags.splice(i, 1)
    }
    var i = archivetask.tags.indexOf("aorinbox")
    if(i != -1) {
      archivetask.tags.splice(i, 1)
    }
    archivetask.tags.push("movetoarchive")
    var id = archivetask._id
    delete archivetask._id
    Tasksbacklog.insert(archivetask)
    Taskspending.update({_id: id},{$set: archivetask})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: id},{$set: {context: "movetoarchive"}})
  },
})
