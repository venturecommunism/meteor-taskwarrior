Template.alarmseteditingdialog.alarmsettitle = function () {
  var alarmsettitle = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (alarmsettitle) {
  return alarmsettitle.description
  }
}

Template.alarmseteditingdialog.payload = function () {
  return Taskspending.findOne({_id: Session.get('alarmsetediting')}).payload
}

Template.alarmseteditingdialog.events({
  'click .alarmseteditclose': function (e,t) {
    Session.set('alarmsetediting',false)
  },
  'keyup .newtask-alarmset #add-newtask-alarmset': function (e,t) {
    if (e.which === 13) {
      var project = Taskspending.findOne({_id: Session.get('alarmsetediting')}).project
      Taskspending.insert({type: "alarmsetitem", description: e.target.value, project: project})
    }  
  },
  'keyup .newtask-alarmset #add-newtask-timer-alarmset': function (e,t) {
  }


});

Template.alarmseteditingdialog.tasks = function () {
  var project = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (project) {
    return Taskspending.find({project: project.project, type: "alarmsetitem"})
  }
}


