Template.checklistselection.checklistitems = function () {
  return Taskspending.findOne({project: this.project, type: "checklistitem"})
}

Template.checklistselection.checklisttitle = function () {
  var checklisttitle = Taskspending.findOne({_id: Session.get('checklistediting')})
  if (checklisttitle) {
  return checklisttitle.description
  }
}

Template.checklistselection.payload = function () {
  return Taskspending.findOne({_id: Session.get('checklistediting')}).payload
}

Template.checklistselection.events({
  'click .checklisteditclose': function (e,t) {
    Session.set('checklistediting',false)
  },
  'keyup .newtask-checklist #add-newtask-checklist': function (e,t) {
    if (e.which === 13) {
      var project = Taskspending.findOne({_id: Session.get('checklistediting')}).project
      Taskspending.insert({owner: Meteor.userId(), type: "checklistitem", description: e.target.value, project: project})
    }  
  },
  'keyup .newtask-checklist #add-newtask-context-checklist': function (e,t) {
  }


});

Template.checklistselection.tasks_inpayload = function () {
  var payload = this.payload
  var project = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (project) {
    return Taskspending.find({_id: {$in: payload}, project: project.project, type: "checklistitem"})
  }
}

Template.checklistselection.tasks_notinpayload = function () {
  var payload = this.payload
  var project = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (project) {
    return Taskspending.find({_id: {$nin: payload}, project: project.project, type: "checklistitem"})
  }
}


