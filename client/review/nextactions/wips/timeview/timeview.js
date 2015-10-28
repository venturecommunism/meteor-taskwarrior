Meteor.subscribe('taskspendingcalendar', function () {
  Session.set('taskspending_dataloaded', true)
})

Template.timeview.helpers({
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
  dueclock: function () {
    return Session.get("timer-" + this.uuid)
  },
  duedate: function () {
    if (this.due) {
      var newstringpartsT = this.due.split("T")
      var newstringpartsZ = newstringpartsT[1].split("Z")
      var newstringwhole = newstringpartsT[0] + newstringpartsZ[0]
      return newstringpartsT[0].substring(4,6) +'/'+ newstringpartsT[0].substring(6,8) +'/'+ newstringpartsT[0].substring(0,4)
    }
    else {
      return false
    }
  },
  date: function () {
    var dt = new Date();
    var month = dt.getMonth()+1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    var time = dt.getTime();
    var date = new Date(time);
    return 'Date and time is ' + date.toString();
  },
})

Template.timeview.events({
  'dblclick .todo-item': function (e, t) {
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
// console.log(uuid)
        Tasksbacklog.insert({owner: Meteor.userId(), description: taskVal, entry: formattednow, uuid:uuid})
        Taskspending.update({_id:this._id},{$set:{description: taskVal, entry: formattednow}})
        Session.set('editing_itemname', null);
       }
     }
  },
  'click .closecalendarsection': function(e,t){
    Session.set('calendarhidden', true)
  },
})

Template.timeview.helpers({
  // the posts cursor
  timeviewtasks: function () {
    var now = moment()
    var nowplusoneday = now.add(1, 'days')
    var bytomorrow = formattedMoment(nowplusoneday)
    console.log(bytomorrow)
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}, {timerank: {$lt: bytomorrow}}]}, {sort: {timerank: 1}})
  },
})
