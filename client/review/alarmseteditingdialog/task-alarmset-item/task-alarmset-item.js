Deps.autorun(function () {
if (Session.get('taskspending_dataloaded')) {
console.log('this one works')
cursor = Taskspending.find({status: {$ne: "completed"}, $and: [{tags: {$ne: "inbox"}}, {due: {$exists: true}}, {context: {$exists: false}}]}, {sort: {due:1}})

cursor.forEach(function (entry) {
  var clock, interval, timeLeft;

var formattednow = formattedNow()
var newstringparts = entry.due.substring(0,4) + "-" + entry.due.substring(4,6) + "-" + entry.due.substring(6,8) + "-" + entry.due.substring(9,11) + "-" + entry.due.substring(11,13) + "-" + entry.due.substring(13,15)
var newformattednow = formattednow.substring(0,4) + "-" + formattednow.substring(4,6) + "-" + formattednow.substring(6,8) + "-" + formattednow.substring(9,11) + "-" + formattednow.substring(11,13) + " " + formattednow.substring(13,15)
var momentone = moment(newstringparts, "YYYY-MM-DD-HH-mm-ss")
var momenttwo = moment(newformattednow, "YYYY-MM-DD-HH-mm-ss")
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
      console.log("That's All Folks");
      Session.set("timer-" + uuid, undefined)
      return Meteor.clearInterval(interval);
    }
  };

  interval = Meteor.setInterval(timeLeft, 1000);
})

}
})


Template.task_alarmset_item.dueclock = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
    if (Session.equals("timer-" + this.uuid, '0') && Notification.permission === "granted") {
var options = {body: ''}
if (this.payload) {
//        var n = new Notification("ALARM: " + this.description, options);
} else {
        var n = new Notification(this.description, options);
        n.onclose = function () {
          alert('hi')
        }
}
        var todolist = Taskspending.find({_id: {$in: this.payload}}).fetch()
var todoliststring = ""
var mathrand = Math.floor((Math.random() * 100000) + 1);
var c = {}
c[mathrand] = 0
for (var i=0; i < todolist.length; i++) {
console.log(todolist[i])
var options = {body: todolist[i].description}
var n = new Notification(this.description, options);
  todoliststring += todolist[i].description + ","
  c[mathrand] += 1
  if (c[mathrand] == todolist.length) {
var thisalarm = this
    n.onclose = function () {
      if (thisalarm.nextalarm) {
var nextalarm = Taskspending.findOne({_id: thisalarm.nextalarm})

var formattednow = formattedNow()
var newformattednow = formattednow.substring(0,4) + "-" + formattednow.substring(4,6) + "-" + formattednow.substring(6,8) + "-" + formattednow.substring(9,11) + "-" + formattednow.substring(11,13) + " " + formattednow.substring(13,15)
var momentone = moment(newformattednow, "YYYY-MM-DD-HH-mm-ss")
var momenttwo = momentone.add('m', nextalarm.timer)
var formattedmomenttwo = momenttwo.format('YYYYMMDD') + 'T' + momenttwo.format('HHmmss') + 'Z'
Taskspending.update({_id: nextalarm._id}, {$set: {due:formattedmomenttwo}})
Tracker.flush()

      }
    }
  }
}
 
console.log(todoliststring)
//var options = {body: ''}
//        var n = new Notification(this.description, options);
    }
console.log(this.uuid)
  return Session.get("timer-" + this.uuid)
}

Template.task_alarmset_item.rendered = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
}

Session.set('editing_itemname', null);

Template.task_alarmset_item.editing = function () {
  return Session.equals('editing_itemname', this._id);
};

Template.task_alarmset_item.events({
  'dblclick .todo-item': function (e, t) {
//    alert('Hi');
//    Session.set('editing_itemname', this._id);
//    Meteor.flush(); // update DOM before focus
//    focus_field_by_id("todo-input");
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
console.log(uuid)
        console.log(Tasksbacklog.insert({description: taskVal, entry: formattednow, uuid:uuid}))
        console.log(Taskspending.update({_id:this._id},{$set:{description: taskVal, entry: formattednow}}))
        Session.set('editing_itemname', null);
       }
     }
  },
  'click .startprocessing-butto2': selectTaskProcessing,
// trying to figure out how to get this event to fire along with selectTaskProcessing therefore including 'div'
//  'click .startprocessing-button-foralarms': function (e,t) {
//console.log('it werked')
//    Session.set('alarmbeingprocessed', this._id)
//selectTaskProcessing(e,t)
//  }


});

/*
Template.todo_item.events[ okcancel_events('#todo-input') ] =
  make_okcancel_handler({
    ok: function (value) {
      Todos.update(this._id, {$set: {text: value}});
      Session.set('editing_itemname', null);
    },
    cancel: function () {
      Session.set('editing_itemname', null);
    }
  });
*/

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
};

Template.task_alarmset_item.checkedcontext = function () {
  if (Session.get("multicontext")) {
    if (Session.get("multicontext").indexOf(this.context) > -1) {
      return 'checked';
    }
  }
}

