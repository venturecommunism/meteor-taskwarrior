// setting the multicontext
Session.setDefault('multicontext', [])
/*
Template.do.rendered = function () {
if (Taskspending.findOne({type: 'default_multicontext'})) {
    Session.set('multicontext', Taskspending.findOne({type: 'default_multicontext'}).payload)
} else {
  if (navigator.appVersion == '5.0 (Android)') {
  Session.set('multicontext', ["anywhere", "social", "outside"])
  } else {
  Session.set('multicontext', ["home", "internet", "phone", "projectplanning", "coding"])
  }
}
}
*/

// putting the clock code into a Meteor.subscribe ready() callback

Template.do.helpers({
  tasks: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}})
  },
  tasks2: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: {$in: ["kickstart", "mit"]}}, {context: {$exists: false}}]}, {sort: {rank: 1}})
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
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
  somedaymaybeproject: function () {
    return Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
  },
  checkedcontext: function () {
    if (Session.get("multicontext")) {
      if (Session.get("multicontext").indexOf(this.context) > -1) {
        return '+';
      }
      else {
        return '-';
      }
    }
  },
  is_doing: function () {
    return Session.get('do_status')
  },
  largeroutcome: function () {
    if (Taskspending.findOne({project: this.project, tags: "largeroutcome"})) {
      return Taskspending.findOne({project: this.project, tags: "largeroutcome"}).description;
    }
    else {
      return ''
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
  contexts: function () {
    return context_infos()
  },
})

Template.do.events({
  'click .startprocessing-button': selectTaskProcessing,
  'dblclick .todo-item': function (e, t) {
    Session.set('editing_itemname', this._id);
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("todo-input");
  },
  'focusout #todo-input': function (e, t) {
    Session.set('editing_itemname', null);
    Meteor.flush();
  },
  'click #contextpicker li .btn': function (e,t) {
    tempcontext = Session.get("multicontext")
    if (!tempcontext) {
      Session.set("multicontext", [this.context])
    }
    else if (tempcontext.length == 0) {
      Session.set("multicontext", [this.context])
    }
    else if (Session.get("multicontext").indexOf(this.context) < 0) {
      tempcontext.push(this.context)
      Session.set("multicontext", tempcontext)
    }    
    else {
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("multicontext", tempcontext)
    }
  },
})

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus()
    input.select()
  }
};

