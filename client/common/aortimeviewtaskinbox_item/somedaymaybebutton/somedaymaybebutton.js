Template.somedaymaybebutton.events({
  'click .somedaymaybe': function () {
    somedaymaybetask = Taskspending.findOne({_id: this._id})
    var i = somedaymaybetask.tags.indexOf("inbox")
    if(i != -1) {
      somedaymaybetask.tags.splice(i, 1)
    }
    var i = somedaymaybetask.tags.indexOf("aorinbox")
    if(i != -1) {
      somedaymaybetask.tags.splice(i, 1)
    }
    somedaymaybetask.tags.push("somedaymaybe")
    id = somedaymaybetask._id
    delete somedaymaybetask._id
    Tasksbacklog.insert(somedaymaybetask)
    Taskspending.update({_id: id},{$set: somedaymaybetask})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: id},{$set: {context: "somedaymaybe"}})
  }
})
