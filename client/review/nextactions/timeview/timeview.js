Session.setDefault("energylevel", "calendaronly")

// moved below code over from the server

Tracker.autorun(function () {
  var later = Taskspending.findOne({due: {$exists: 1}}, {sort: {due: 1}})
  if (later) {
    var laterdue = later.due
  }
  var now = Session.get('now')
  if (laterdue <= now) {
    var tasktomove = Taskspending.findOne({due: {$exists: 0}, timerank: {$lte: laterdue}}, {sort: {timerank: -1}})
    if (tasktomove) {

    var now = Session.get('now')
    var calendartasks = Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}, {due: {$exists :1}}]}, {sort: {timerank: 1}}).map(
      function (somecalendardocument) {
        return somecalendardocument.timerank
      }
    )
    var starttimevar = formattedNow()
    var endtimevar = Taskspending.findOne({due: {$gt: formattedNow()}}).timerank
    var calendartaskslength = calendartasks.length
    for (var i = 0; i < calendartaskslength; i++) {
      var durations = Taskspending.find({duration: {$exists: 1}, rank: {$lte: tasktomove.rank}, timerank: {$gte: starttimevar}, timerank: {$lt: calendartasks[i]}}).map(
        function (durationdocument) {
          return {_id: durationdocument._id, timerank: durationdocument.timerank, rank: durationdocument.rank}
        }
      )
      var durationslength = durations.length
      var intervalduration = moment.duration("PT0H0M0S")
      console.log(intervalduration)
      for (var j = 0; j < durationslength; j++) {
        console.log(durations[j])
        var intervalduration = intervalduration.add(Taskspending.findOne({_id: durations[j]._id}).duration)
      }
      var lastcalmoment = timestamptomoment(starttimevar)
      var nextcalmoment = timestamptomoment(endtimevar)
      var calendarintervalduration = moment.duration(nextcalmoment.diff(lastcalmoment))
      var freeintervalduration = calendarintervalduration.subtract(intervalduration)
      if (freeintervalduration > moment.duration(tasktomove.duration)) {
        var timerank = formattedMoment(moment(nextcalmoment).subtract(intervalduration).subtract(moment.duration(tasktomove.duration)))
        console.log(moment.duration(tasktomove.duration).humanize())
        console.log(timerank)
        console.log("freecal is " + freeintervalduration + " and intervalduration is " + intervalduration)
        Taskspending.update({_id: tasktomove._id}, {$set: {timerank: timerank}})
        break
      }
      if (Taskspending.findOne({due: {$gt: endtimevar}})) {
        var starttimevar = endtimevar
        var endtimevar = Taskspending.findOne({due: {$gt: endtimevar}}).timerank
      } else {
        break
      }
    }



    }
  }
})

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
  overdue: function () {
    if (this.due < Session.get("now")) {
      return 'overdue'
    }
  },
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
  dueclock: function () {
    return countdowntimer(this.due)
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
  'click .energy0': function () {
    Session.set("energylevel", "calendaronly")
  },
  'click .energy1': function () {
    Session.set("energylevel", 1)
  },
  'click .energy2': function () {
    Session.set("energylevel", 2)
  },
  'click .energy3': function () {
    Session.set("energylevel", 3)
  },
  'click .energy4': function () {
    Session.set("energylevel", 4)
  },
  'click .energy5': function () {
    Session.set("energylevel", 5)
  },
  'click .energy6': function () {
    Session.set("energylevel", 6)
  },
  'click .energy7': function () {
    Session.set("energylevel", 7)
  },
})

Template.timeview.helpers({
  // the posts cursor
  overduetasks: function () {
    return Taskspending.find({due: {$lt: Session.get('now')}}, {sort: {due: 1}})
  },
  zeroselected: function () {
    if (Session.equals("energylevel", "calendaronly")) {
      return 'btn-primary'
    }
  },
  oneselected: function () {
    if (Session.equals("energylevel", 1)) {
      return 'btn-primary'
    }
  },
  twoselected: function () {
    if (Session.equals("energylevel", 2)) {
      return 'btn-primary'
    }
  },
  threeselected: function () {
    if (Session.equals("energylevel", 3)) {
      return 'btn-primary'
    }
  },
  fourselected: function () {
    if (Session.equals("energylevel", 4)) {
      return 'btn-primary'
    }
  },
  fiveselected: function () {
    if (Session.equals("energylevel", 5)) {
      return 'btn-primary'
    }
  },
  sixselected: function () {
    if (Session.equals("energylevel", 6)) {
      return 'btn-primary'
    }
  },
  sevenselected: function () {
    if (Session.equals("energylevel", 7)) {
      return 'btn-primary'
    }
  },
})

Template.timeview.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.calendarlimit = new ReactiveVar(1);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var calendarlimit = instance.calendarlimit.get();

    // console.log("Asking for "+calendarlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingcalendar', calendarlimit, function () {
      Session.set('taskspending_dataloaded', true)
    })

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+calendarlimit+" posts. \n\n")
      instance.loaded.set(calendarlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingcalendar = function() {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: {$ne: "inbox"}, due: {$gte: Session.get('now')}}, {sort: {due: 1}, limit: instance.loaded.get()})
  }

};

Template.timeview.helpers({
  // the posts cursor
  upcomingcalendartasks: function () {
    return Template.instance().taskspendingcalendar();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingcalendar().count() >= Template.instance().calendarlimit.get()
  },
  hasFewerPosts: function () {
    return Template.instance().taskspendingcalendar().count() > 1
  },
  calendaronly: function () {
    return Session.equals("energylevel", "calendaronly")
  },
  timeviewtask: function () {
    return Taskspending.findOne({energylevel: Session.get("energylevel")}, {sort: {rank: 1}})
  },
});

Template.timeview.events({
  'click .load-more-calendar': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var calendarlimit = instance.calendarlimit.get();

    // increase limit by 5 and update it
    if (calendarlimit != 1) {
      calendarlimit += 5
    } else {
      calendarlimit += 4
    }
    instance.calendarlimit.set(calendarlimit)
  },
  'click .load-fewer-calendar': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var calendarlimit = instance.calendarlimit.get();

    // set calendarlimit to 1
    calendarlimit = 1
    instance.calendarlimit.set(calendarlimit)
  },
});

// end modular subscription loading

