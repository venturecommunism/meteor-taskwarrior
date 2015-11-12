Session.set('editing_itemname', null);

Template.alarmset_checklist_item2.editing = function () {
  return Session.equals('editing_itemname', this._id);
};

Template.alarmset_checklist_item2.events({
  'click input.checklistcheckbox': function (e, t) {


    var temppayload = Taskspending.findOne({_id: Session.get('current_processedtask')}).payload
console.log('temppayload is ' + temppayload)
    if (temppayload.length == 0) {
      Taskspending.update({_id: Session.get('current_processedtask')}, {$set: {payload: [this._id]}})
    }
    else if (Taskspending.findOne({_id: Session.get('current_processedtask')}).payload.indexOf(this._id) < 0) {
      temppayload.push(this._id)
      Taskspending.update({_id: Session.get('current_processedtask')}, {$set: {payload: temppayload}})
    }
    else {
      var temppayloadindex = temppayload.indexOf(this._id)
      var splicedtemppayload = temppayload.splice(temppayloadindex,1)
console.log('this applies 2' + temppayload)
      Taskspending.update({_id: Session.get('current_processedtask')}, {$set: {payload: temppayload}})
    }
  },
  'dblclick .todo-item': function (e, t) {
//    alert('Hi');
    Session.set('editing_itemname', this._id);
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("todo-input");
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
        console.log(Tasksbacklog.insert({owner: Meteor.userId(), description: taskVal, entry: formattednow, uuid:uuid}))
        console.log(Taskspending.update({_id:this._id},{$set:{description: taskVal, entry: formattednow}}))
        Session.set('editing_itemname', null);
       }
     }
  },

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

Template.alarmset_checklist_item2.checklistiteminpayload = function () {
var payload = this.project
  if (payload.indexOf(this._id) > -1) {
    return 'checked';
  }

}

