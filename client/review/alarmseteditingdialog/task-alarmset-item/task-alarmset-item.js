Session.set('editing_itemname', null)

Template.task_alarmset_item.helpers({
  dueclock: function () {
    return Session.get("timer-" + this.uuid)
  },
  checkedcontext: function () {
    if (Session.get("multicontext")) {
      if (Session.get("multicontext").indexOf(this.context) > -1) {
        return 'checked';
      }
    }
  },
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
})

Template.task_alarmset_item.events({
  'dblclick .todo-item': function (e, t) {
  },
  'focusout #todo-input': function (e, t) {
    Session.set('editing_itemname', null);
    Meteor.flush();
  },
  'keyup #todo-input': function (e,t) {
    if (e.which === 13)
    {
      var taskVal = String(e.target.value || "");
      if (taskVal)
      {
        var formattednow = formattedNow()
        var uuid = this.uuid
        Session.set('editing_itemname', null);
       }
     }
  },
  'click .startprocessing-butto2': selectTaskProcessing,
})

Template.task_alarmset_item.rendered = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
}

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
}


Deps.autorun(function () {
if (Session.get('taskspending_dataloaded')) {
cursor = Taskspending.find({status: {$ne: "completed"}, $and: [{tags: {$ne: "inbox"}}, {due: {$exists: true}}, {context: {$exists: false}}]}, {sort: {due:1}})


cursor.forEach(function (entry) { 

  var clock, interval, timeLeft;

var formattednow = formattedNow()
var newstringparts = entry.due.substring(0,4) + "-" + entry.due.substring(4,6) + "-" + entry.due.substring(6,8) + "-" + entry.due.substring(9,11) + "-" + entry.due.substring(11,13) + "-" + entry.due.substring(13,15)
var newformattednow = formattednow.substring(0,4) + "-" + formattednow.substring(4,6) + "-" + formattednow.substring(6,8) + "-" + formattednow.substring(9,11) + "-" + formattednow.substring(11,13) + " " + formattednow.substring(13,15)

if (entry.payload) {
var cursorthingie = Taskspending.find({$and: [{checked: "no"}, {_id: {$in: entry.payload}}]}).fetch()
}
var momenttwo = moment(newformattednow, "YYYY-MM-DD-HH-mm-ss")
var momentone = moment(newstringparts, "YYYY-MM-DD-HH-mm-ss")

var diff = momentone.diff(momenttwo, 'seconds')
  clock = diff;
  var uuid = entry.uuid

  timeLeft = function() {
    if (clock > 0) {
      clock--;
var days = Math.floor(clock / 86400)
var hours = Math.floor((clock - days * 86400) / 3600)
var minutes = Math.floor((clock - days * 86400 - hours * 3600) / 60)
var seconds = clock % 60
      Session.set("timer-" + uuid, (days == 0 ? "" : days + " days ") + ((days == 0 && hours == 0) ? "" : (hours < 10 ? "0" : "") + hours + ":") + ((days == 0 && hours == 0 && minutes == 0) ? "" : ((days == 0 && hours == 0 && minutes < 10) ? "" : (minutes < 10 ? "0" : "")) + minutes + ":") + ((days == 0 && hours == 0 && minutes == 0) ? "" : (seconds < 10 ? "0" : "")) + seconds);

    } else {


  if (Session.equals("timer-" + entry.uuid, '0') && Notification.permission === "granted") {
    var options = {body: ''}
    if (!entry.payload) {
      var n = new Notification(entry.description, options);
      n.onclose = function () {
        alert('hi')
      }
    }
if (cursorthingie) {
var todolist = cursorthingie
} else {
var todolist = []
}
    var mathrand = Math.floor((Math.random() * 100000) + 1);
    var c = {}
    c[mathrand] = 0
    for (var i=0; i < todolist.length; i++) {
      var options = {body: todolist[i].description}
      var n = new Notification(entry.description, options);
      c[mathrand] += 1
      if (c[mathrand] == todolist.length) {
        var thisalarm = entry
        n.onclose = function () {
          if (Taskspending.findOne({alarmorder: thisalarm.alarmorder + 1})._id) {
            var nextalarm = Taskspending.findOne({alarmorder: thisalarm.alarmorder + 1})
            var formattednow = formattedNow()
            var newformattednow = formattednow.substring(0,4) + "-" + formattednow.substring(4,6) + "-" + formattednow.substring(6,8) + "-" + formattednow.substring(9,11) + "-" + formattednow.substring(11,13) + " " + formattednow.substring(13,15)
            var momentone = moment(newformattednow, "YYYY-MM-DD-HH-mm-ss")
var nextcursorthingie = Taskspending.find({$and: [{checked: "no"}, {_id: {$in: nextalarm.payload}}]}).fetch()
if (nextcursorthingie == '' || nextcursorthingie == []) {
            var momenttwo = momentone.add('s', 5)
} else {
  var project = Taskspending.findOne({_id: Session.get('alarmsetediting')})
           var momenttwo = momentone.add('m', project.timer)
}
            var formattedmomenttwo = momenttwo.format('YYYYMMDD') + 'T' + momenttwo.format('HHmmss') + 'Z'
            Taskspending.update({_id: nextalarm._id}, {$set: {due:formattedmomenttwo}})
          }
        }
      }
    }
  }


      Session.set("timer-" + uuid, undefined)
      return Meteor.clearInterval(interval);
    }
  };

  interval = Meteor.setInterval(timeLeft, 1000);

})

}
})
