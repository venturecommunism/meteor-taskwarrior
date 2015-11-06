// moved below code over from the server

Timeviewdurationtasks = Taskspending.find({duration: {$exists: 1}})
Timeviewdurationtasks.observe({
  added: function (document) {
    var now = moment()
    var nowplusoneday = now.add(1, 'days')
    var bytomorrow = formattedMoment(nowplusoneday)
    var calendartasks = Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}, {due: {$exists :1}}]}, {sort: {timerank: 1}}).map(
      function (somecalendardocument) {
        return somecalendardocument.timerank
      }
    )
    var starttimevar = formattedNow()
    var endtimevar = Taskspending.findOne({due: {$gt: formattedNow()}}).timerank
    var calendartaskslength = calendartasks.length
    for (var i = 0; i < calendartaskslength; i++) {
      var durations = Taskspending.find({duration: {$exists: 1}, rank: {$lte: document.rank}, timerank: {$gte: starttimevar}, timerank: {$lt: calendartasks[i]}}).map(
        function (durationdocument) {
          return {timerank: durationdocument.timerank, rank: durationdocument.rank}
        }
      )
      var durationslength = durations.length
      var intervalduration = moment.duration("PT0H0M0S")
      for (var j = 0; j < durationslength; j++) {
        var intervalduration = moment.intervalduration().add(Taskspending.findOne({_id: durations[j]}).duration)
      }
      var lastcalmoment = timestamptomoment(starttimevar)
      var nextcalmoment = timestamptomoment(endtimevar)
      var calendarintervalduration = moment.duration(nextcalmoment.diff(lastcalmoment))
      var freeintervalduration = calendarintervalduration.subtract(intervalduration)
      if (freeintervalduration > moment.duration(document.duration)) {
        var timerank = formattedMoment(moment(nextcalmoment).subtract(intervalduration).subtract(moment.duration(document.duration)))
        console.log(moment.duration(document.duration).humanize())
        console.log(timerank)
        console.log("freecal is " + freeintervalduration + " and intervalduration is " + intervalduration)
        Taskspending.update({_id: document._id}, {$set: {timerank: timerank}})
        break
      }
      if (Taskspending.findOne({due: {$gt: endtimevar}})) {
        var starttimevar = endtimevar
        var endtimevar = Taskspending.findOne({due: {$gt: endtimevar}}).timerank
      } else {
        break
      }
    }
  },
  changed: function (newDocument, oldDocument) {
    var now = moment()
    var nowplusoneday = now.add(1, 'days')
    var bytomorrow = formattedMoment(nowplusoneday)
    var calendartasks = Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}, {due: {$exists :1}}]}, {sort: {timerank: 1}}).map(
      function (somecalendardocument) {
        return somecalendardocument.timerank
      }
    )
    var starttimevar = formattedNow()
    var endtimevar = Taskspending.findOne({due: {$gt: formattedNow()}}).timerank
    var calendartaskslength = calendartasks.length
    for (var i = 0; i < calendartaskslength; i++) {
      var durations = Taskspending.find({duration: {$exists: 1}, rank: {$lte: newDocument.rank}, timerank: {$gte: starttimevar}, timerank: {$lt: calendartasks[i]}}).map(
        function (durationdocument) {
          return {timerank: durationdocument.timerank, rank: durationdocument.rank}
        }
      )
      var durationslength = durations.length
      var intervalduration = moment.duration("PT0H0M0S")
      for (var j = 0; j < durationslength; j++) {
        var intervalduration = moment.intervalduration().add(Taskspending.findOne({_id: durations[j]}).duration)
      }
      var lastcalmoment = timestamptomoment(starttimevar)
      var nextcalmoment = timestamptomoment(endtimevar)
      var calendarintervalduration = moment.duration(nextcalmoment.diff(lastcalmoment))
      var freeintervalduration = calendarintervalduration.subtract(intervalduration)
      if (freeintervalduration > moment.duration(newDocument.duration)) {
        var timerank = formattedMoment(moment(nextcalmoment).subtract(intervalduration).subtract(moment.duration(newDocument.duration)))
        console.log(moment.duration(newDocument.duration).humanize())
        console.log(timerank)
        console.log("freecal is " + freeintervalduration + " and intervalduration is " + intervalduration)
        Taskspending.update({_id: newDocument._id}, {$set: {timerank: timerank}})
        break
      }
      if (Taskspending.findOne({due: {$gt: endtimevar}})) {
        var starttimevar = endtimevar
        var endtimevar = Taskspending.findOne({due: {$gt: endtimevar}}).timerank
      } else {
        break
      }
    }
  },
})

// moved above code over from the server


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
    var nextduedate = Taskspending.findOne({due: {$gte: formattedNow()}}).timerank
    console.log(nextduedate + " is nextduedate")
    var nextplusoneday = timestamptomoment(nextduedate).add(24, 'hours')
    var bytomorrow = formattedMoment(nextplusoneday)
    console.log(bytomorrow)
    return Taskspending.find({timerank: {$lt: bytomorrow}}, {sort: {timerank: 1}})
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {timerank: {$lt: bytomorrow}}]}, {sort: {timerank: 1}})
  },
})
