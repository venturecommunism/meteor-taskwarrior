Calendartimeviewtasks = Taskspending.find({due: {$exists: 1}})
Calendartimeviewtasks.observe({
  added: function (document) {
    if (!document.timerank) {
      Taskspending.update({_id: document._id}, {$set: {timerank: document.due}})
    }
  },
  changed: function (newDocument, oldDocument) {
    Taskspending.update({_id: newDocument._id}, {$set: {timerank: newDocument.due}})
  },
})

