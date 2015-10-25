Session.set('editing_itemname', null);

Template.navtask.helpers({
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
  is_kickstarter: function () {
    var truefalse = null
    if (Taskspending.findOne({_id: this._id, tags: "kickstart"})) {
      truefalse = true
    }
    return truefalse
  },
  nokickstart: function () {
    return !Taskspending.findOne({_id: this._id, tags: "kickstart"});
  },
  mitornot: function () {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      return 'active'
    }
    else {
      return ''
    }
  },
})

Template.navtask.events({
  'click .choosesequential': function (e, t) {
    if (Taskspending.findOne({_id: this._id, tags: "milestone"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "milestone"}})
    }
    else {
      Taskspending.update({_id: this._id}, {$push: {tags: "milestone"}})
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
  'click .mit': function (e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "mit"}})
      Taskspending.update({_id: this._id}, {$pull: {wip: "contwip"}})
      if (!Taskspending.findOne({project: this.project, tags: "mit"})) {
        var projectid = Taskspending.findOne({project: this.project, tags: "largeroutcome"})._id
        Taskspending.update({_id: projectid}, {$push: {tags: "kickstarterless"}})
      }
    }
    else {
      Taskspending.update({_id: this._id}, {$push: {tags: "mit"}})
      Taskspending.update({_id: this._id}, {$push: {wip: "contwip"}})
      Taskspending.update({_id: projectid}, {$pull: {tags: "kickstarterless"}})
      if (!this.rank && this.project && Taskspending.findOne({project: this.project, tags: "largeroutcome"}).rank) {
        var rank = Taskspending.findOne({project: this.project, tags: "largeroutcome"}).rank
        Taskspending.update({_id: this._id}, {$set: {rank: rank}})
      }
    }
  },
  'click .choosechecklistitem': function (e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "checklistitem"}})
    }
    else {
      Taskspending.update({_id: this._id}, {$push: {tags: "checklistitem"}})
    }
  }
});

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
}
