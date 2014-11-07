Template.alarmseteditingdialog.alarmsettitle = function () {
  var alarmsettitle = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (alarmsettitle) {
  return alarmsettitle.description
  }
}

Template.alarmseteditingdialog.timer = function () {
  var timer = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (timer) {
  return timer.timer
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
      var uuid = guid()
      var project = Taskspending.findOne({_id: Session.get('alarmsetediting')}).project
      Taskspending.insert({payload: [], type: "alarmsetitem", uuid: uuid, description: e.target.value, project: project})
    }  
  },
  'keyup .newtask-alarmset #add-newtask-timer-alarmset': function (e,t) {
  },


});

Template.alarmseteditingdialog.tasks = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }

  var project = Taskspending.findOne({_id: Session.get('alarmsetediting')})
  if (project) {
    return Taskspending.find({project: project.project, type: "alarmsetitem"}, {sort: {alarmorder: 1}})
  }
}


