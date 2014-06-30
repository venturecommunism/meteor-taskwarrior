Template.do.is_doing = function () {
  return Session.get('do_status')
}

Template.do.tasks = function () {
  if (Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {project: {$exists: false}}, {context: Session.get('do_context')}]})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due:1}})
  }
}

Template.do.tasks2 = function () {
  if (Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: Session.get('do_context')}]})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: {$exists: false}}]}, {sort: {due:1}})
  }
}

Template.do.editing = function () {
  return Session.equals('editing_itemname', this._id);
};


Template.do.events({
  'click .startprocessing-button': selectTaskProcessing,

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
        console.log(Tasksbacklog.insert({description: taskVal, entry: formattednow, uuid:uuid}))
        console.log(Taskspending.update({_id:this._id},{$set:{description: taskVal, entry: formattednow}}))
        Session.set('editing_itemname', null);
       }
     }
  },


});

Template.do.largeroutcome = function () {
  if (Taskspending.findOne({project: this.project, tags: "largeroutcome"})) {
    return Taskspending.findOne({project: this.project, tags: "largeroutcome"}).description;
  }
  else {
    return ''
  }
};

Template.do.somedaymaybeproject = function () {
  return Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
}

Template.do.contexts = function () {
  return context_infos()
}


Template.do.duedate = function () {
if (this.due) {
var newstringpartsT = this.due.split("T")
var newstringpartsZ = newstringpartsT[1].split("Z")
var newstringwhole = newstringpartsT[0] + newstringpartsZ[0]
  return newstringpartsT[0].substring(4,6) +'/'+ newstringpartsT[0].substring(6,8) +'/'+ newstringpartsT[0].substring(0,4)
}
else {
return false
}
}

Template.do.date = function () {
var dt = new Date();

// Display the month, day, and year. getMonth() returns a 0-based number.
var month = dt.getMonth()+1;
var day = dt.getDate();
var year = dt.getFullYear();
return 'Today is ' + month + '/' + day + '/' + year;
}

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
};

