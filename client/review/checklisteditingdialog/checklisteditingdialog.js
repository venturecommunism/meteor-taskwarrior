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
  'click .checklisteditclose': function (e,t) {
    Session.set('checklistediting',false)
  },
  'keyup .newtask-checklist #add-newtask-checklist': function (e,t) {
    if (e.which === 13) {
      var project = Taskspending.findOne({_id: Session.get('checklistediting')}).project
      Taskspending.insert({type: "checklistitem", description: e.target.value, project: project})
    }  
  },
  'keyup .newtask-checklist #add-newtask-context-checklist': function (e,t) {
  }


});

Template.checklisteditingdialog.tasks = function () {
  var project = Taskspending.findOne({_id: Session.get('checklistediting')})
  if (project) {
    return Taskspending.find({project: project.project, type: "checklistitem"})
  }
}


