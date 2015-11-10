Template.previouscalendar.helpers({
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

Template.previouscalendar.events({
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
  'click .closepreviouscalendarsection': function(e,t){
    Session.set('previouscalendarhidden', true)
  },
})

// begin modular subscription loading

Template.previouscalendar.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.previouscalendarlimit = new ReactiveVar(0);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var previouscalendarlimit = instance.previouscalendarlimit.get();

    // console.log("Asking for "+previouscalendarlimit+" posts…")

    // subscribe to the posts publication

    if (previouscalendarlimit > 0) {
      var subscription = instance.subscribe('tasksbacklogpreviouscalendar', previouscalendarlimit, function () {
        Session.set('tasksbacklog_dataloaded', true)
      })
    }

    // if subscription is ready, set limit to newLimit
    if (subscription && subscription.ready()) {
      // console.log("> Received "+previouscalendarlimit+" posts. \n\n")
      instance.loaded.set(previouscalendarlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.tasksbacklogpreviouscalendar = function() {
    return Tasksbacklog.find({status: "completed", $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: instance.loaded.get()})
  }

};

Template.previouscalendar.helpers({
  // the posts cursor
  previouscalendartasks: function () {
    return Template.instance().tasksbacklogpreviouscalendar();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().tasksbacklogpreviouscalendar().count() >= Template.instance().previouscalendarlimit.get();
  },
  hasFewerPosts: function () {
    return Template.instance().tasksbacklogpreviouscalendar().count() > 0
  },
});

Template.previouscalendar.events({
  'click .load-more-previouscalendar': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var previouscalendarlimit = instance.previouscalendarlimit.get();

    // increase limit by 5 and update it
    previouscalendarlimit += 5;
    instance.previouscalendarlimit.set(previouscalendarlimit)
  },
  'click .load-fewer-previouscalendar': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var previouscalendarlimit = instance.previouscalendarlimit.get();

    // increase limit by 5 and update it
    previouscalendarlimit = 0;
    instance.previouscalendarlimit.set(previouscalendarlimit)
  },
});

// end modular subscription loading


