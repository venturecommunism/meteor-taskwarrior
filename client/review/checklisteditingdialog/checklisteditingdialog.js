Template.checklisteditingdialog.checklisttitle = function () {
  var checklisttitle = Taskspending.findOne({_id: Session.get('checklistediting')})
  if (checklisttitle) {
  return checklisttitle.description
  }
}

Template.checklisteditingdialog.payload = function () {
  return Taskspending.findOne({_id: Session.get('checklistediting')}).payload
}

Template.checklisteditingdialog.events({
  'click .modal .savebutton': function (e,t) {
    Taskspending.update({_id: Session.get('checklistediting')}, {$set: {payload: t.findAll('.modal textarea')[0].value}})
  },
  'click .checklisteditclose': function (e,t) {
    Session.set('checklistediting',false)
  }
});

Template.checklisteditingdialog.tasks = function () {
  var project = Taskspending.findOne({_id: Session.get('checklistediting')})
  if (project) {
    return Taskspending.find({project: project.project, type: "checklistitem"})
  }
}


