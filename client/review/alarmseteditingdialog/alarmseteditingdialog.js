Template.alarmseteditingdialog.helpers({
  tasks: function () {
    if (Notification.permission !== "granted") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      })
    }
    var project = Taskspending.findOne({_id: Session.get('alarmsetediting')})
    if (project) {
      return Taskspending.find({project: project.project, type: "alarmsetitem"}, {sort: {alarmorder: 1}})
    }
  },
  alarmsettitle: function () {
    var alarmsettitle = Taskspending.findOne({_id: Session.get('alarmsetediting')})
    if (alarmsettitle) {
      return alarmsettitle.description
    }
  },
  timer: function () {
    var timer = Taskspending.findOne({_id: Session.get('alarmsetediting')})
    if (timer) {
      return timer.timer
    }
  },
  payload: function () {
    return Taskspending.findOne({_id: Session.get('alarmsetediting')}).payload
  },
})

Template.alarmseteditingdialog.events({
  'click .alarmseteditclose': function (e,t) {
    Session.set('alarmsetediting',false)
  },
  'keyup #timer-alarmset': function (e,t) {
    if (e.which === 13) {

      var project = Session.get('alarmsetediting')

      if (project) {
        Taskspending.update({_id: Session.get('alarmsetediting')}, {$set: {timer: e.target.value}})

      }
    }
  },
  'keyup .newtask-alarmset #add-newtask-alarmset': function (e,t) {
    if (e.which === 13) {
      var uuid = guid()
      var project = Taskspending.findOne({_id: Session.get('alarmsetediting')}).project
      Taskspending.insert({owner: Meteor.userId(), payload: [], type: "alarmsetitem", uuid: uuid, description: e.target.value, project: project})
    }  
  },
  'keyup .newtask-alarmset #add-newtask-timer-alarmset': function (e,t) {
  },


})
