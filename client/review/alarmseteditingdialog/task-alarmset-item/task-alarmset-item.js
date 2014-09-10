Template.task_alarmset_item.dueclock = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
    if (Session.equals("timer-" + this.uuid, '0') && Notification.permission === "granted") {
        var todolist = Taskspending.find({_id: {$in: this.payload}}).fetch()
var todoliststring = ""
for (var i=0; i < todolist.length; i++) {
console.log(todolist[i])
  todoliststring += todolist[i].description + ","
}
console.log(todoliststring)
var options = {body: todoliststring}
        var n = new Notification(this.description, options);
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
  'click .startprocessing-button': selectTaskProcessing,


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

