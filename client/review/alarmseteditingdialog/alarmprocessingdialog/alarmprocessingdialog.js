Template.alarmprocessingdialog.helpers({
  tasks: function () {
    return Taskspending.findOne({_id: Session.get('current_processedtask')})
  },
  has_context: function () {
    return this.context
  },
  has_duedate: function () {
    return this.timer
  },
  processing_alarm: function () {
    return (Session.equals('processing_task',true) && this.type == 'alarmset');
  },
  has_project: function () {
    return (Taskspending.findOne({_id: Session.get('current_processedtask')}).project ? 1 : 0 )
  },
  alarmitemsexist: function () {
    var payload = Taskspending.findOne({_id: Session.get('current_processedtask')}).payload
    if (payload.length > 0) {
      return true
    } else {
      return false
    }
  },
  alarmitems: function () {
    var payload = Taskspending.findOne({_id: Session.get('current_processedtask')}).payload
    return Taskspending.find({_id: {$in: payload}})
  },
  taskcounter: function () {
    return project_infos()[0].count
  },
})

Template.alarmprocessingdialog.events({
  'click .modal .cancel': function(e,t) {
     Session.set('processing_task',false);
   },
  'keyup .title': function (e,t){
    if (e.which === 13)
      {
        projecttask = Taskspending.findOne({_id: Session.get('current_processedtask')})
        projecttask.project = e.target.value
// TODO: have to fix all these backlog inserts
if (e.target.value == '') {
        Taskspending.update({_id: this._id},{$unset:{project:""}})
}
else {
        Taskspending.update({_id: this._id},{$set:{project:e.target.value}})
}
      }
return false;
  },
  'submit form': function (e,t){
    e.preventDefault()
    e.stopPropagation();
    return false;
  },
  'keyup input.context': function(e,t) {
    if (e.which === 13) {
if (e.target.value == '') {
        Taskspending.update({_id: this._id},{$unset:{context:""}})
}
else {
      Taskspending.update({_id: this._id},{$set:{context:e.target.value}})
}
    }
  },
  'keyup input#duedate': function(e,t) {
    if (e.which === 13) {
      Taskspending.update({_id: this._id},{$set:{timer:e.target.value}})
    }
  },
  'focusout .processingdialog': function(e,t) {
// Session.set('processing_task',false);
  },
  'click .trash': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
if (!Session.get('organize_status') && !Session.get('do_status')){
    var i = trashtask.tags.indexOf("inbox");
    if(i != -1) {
      trashtask.tags.splice(i, 1);
    }
    if (trashtask.tags.length == 0) {
      delete trashtask.tags
    }
}
    id = trashtask._id
    delete trashtask._id
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
if (!Session.get('organize_status') && !Session.get('do_status')){
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
} else {
    Session.set('current_processedtask',Taskspending.findOne({tags: {$not: "inbox"}})._id)
}
    selectTaskProcessing
  },
  'click .archive': function() {
    archivetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    archivetask.status = 'completed'
if (!Session.get('organize_status') && !Session.get('do_status')){
    var i = archivetask.tags.indexOf("inbox");
    if(i != -1) {
      archivetask.tags.splice(i, 1);
    }
}
if (archivetask.tags) {
console.log(archivetask.tags)
    archivetask.tags.push("archive")
}
else {
archivetask.tags = ["archive"]
}
    delete archivetask._id
    Tasksbacklog.insert(archivetask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .somedaymaybe': function() {
    somedaymaybetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = somedaymaybetask.tags.indexOf("inbox");
    if(i != -1) {
      somedaymaybetask.tags.splice(i, 1);
    }
    id = somedaymaybetask._id
    delete somedaymaybetask._id
    somedaymaybetask.tags.push("somedaymaybe")
    Tasksbacklog.insert(somedaymaybetask)
    Taskspending.update({_id: id},{$set: somedaymaybetask})
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .do': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
    var i = trashtask.tags.indexOf("inbox");
    if(i != -1) {
      trashtask.tags.splice(i, 1);
    }
    if (trashtask.tags.length == 0) {
      delete trashtask.tags
    }
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .defer': function() {
    defertask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = defertask.tags.indexOf("inbox");
    if(i != -1) {
      defertask.tags.splice(i, 1);
    }
    if (defertask.tags.length == 0) {
      delete defertask.tags
    }
    id = defertask._id
    delete defertask._id
    Tasksbacklog.insert(defertask)
    Taskspending.update({_id: id},{$set: defertask})
    Taskspending.update({_id: id},{$unset: {tags: ""}})
    if (Taskspending.findOne({tags:"inbox"})) {
      Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
      selectTaskProcessing
    }
    else {
      Session.set('processing_task', false);
    }
  },
  'click .save': function () {
var formattednow = formattedNow()
var newformattednow = formattednow.substring(0,4) + "-" + formattednow.substring(4,6) + "-" + formattednow.substring(6,8) + "-" + formattednow.substring(9,11) + "-" + formattednow.substring(11,13) + " " + formattednow.substring(13,15)
var momentone = moment(newformattednow, "YYYY-MM-DD-HH-mm-ss")
var momenttwo = momentone.add('m', Taskspending.findOne({_id: Session.get('alarmsetediting')}).timer)

var formattedmomenttwo = momenttwo.format('YYYYMMDD') + 'T' + momenttwo.format('HHmmss') + 'Z'

    Taskspending.update({_id: this._id}, {$set: {due:formattedmomenttwo}})
Tracker.flush()
  },

});

Template.alarmprocessingdialog.rendered = function () {

var projectnames = Taskspending.find();
var count = 0;
projects = []
projectnames.forEach(function (task) {
  if (task.project && (projects.indexOf(task.project) == -1)) {
    projects.push(task.project)
  }
  count += 1;
})

  $('#typeahead').typeahead({
    name: 'accounts',
    local: ["process", "organize", "project1", "project2", "project3", "project4"]
  })
}
