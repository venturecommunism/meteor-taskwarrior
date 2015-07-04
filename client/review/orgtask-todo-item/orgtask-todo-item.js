Session.set('editing_itemname', null);

Template.orgtask_todo_item.helpers({
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
  is_kickstarter: function () {
    var truefalse = null
    if (Taskspending.findOne({project: this.project, tags: "kickstart"})) {
    truefalse = (this._id == Taskspending.findOne({project: this.project, tags: "kickstart"})._id)
    }
    else if (Taskspending.findOne({project: this.project, tags: "mit"})) {
    truefalse = (this._id == Taskspending.findOne({project: this.project, tags: "mit"})._id)
    }
    return truefalse
  },
  nokickstart: function () {
    if (this.project) {
      return !Taskspending.findOne({project: this.project, tags: {$in: ["kickstart", "mit"]}});
    } else {
      return false
    }
  },
  is_priority: function () {
    if (Session.equals('projopen', this.project) && (!this.tags || this.tags.indexOf('kickstart') === -1)) {
      return true
    }
  },
  is_sequential: function () {
    if (Session.equals('projopen', this.project) && this.tags && this.tags.indexOf('milestone') >= 0) {
      return 'btn-primary'
    } else {
      return 'btn-inverse'
    }
  },
  mitornot: function () {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      return 'active'
    }
    else {
      return ''
    }
  },
  is_checklistitem: function () {
    if (Taskspending.findOne({_id: this._id, tags: "checklistitem"})) {
      return 'active'
    }
    else {
      return ''
    }
  }
})

Template.orgtask_todo_item.events({
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
        console.log(Tasksbacklog.insert({description: taskVal, entry: formattednow, uuid:uuid}))
        console.log(Taskspending.update({_id:this._id},{$set:{description: taskVal, entry: formattednow}}))
        Session.set('editing_itemname', null);
       }
     }
  },
  'click .mit': function (e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "mit"}})
      Taskspending.update({_id: this._id}, {$pull: {wip: "projwip"}})
      Taskspending.update({_id: this._id}, {$pull: {wip: "contwip"}})
      if (!Taskspending.findOne({project: this.project, tags: "mit"})) {
        var projectid = Taskspending.findOne({project: this.project, tags: "largeroutcome"})._id
        Taskspending.update({_id: projectid}, {$push: {tags: "kickstarterless"}})
      }
    }
    else {
      Taskspending.update({_id: this._id}, {$push: {tags: "mit"}})
      if (Taskspending.findOne({project: this.project, tags: "pip"})) {
        Taskspending.update({_id: this._id}, {$push: {wip: "projwip"}})
      }
      if (Taskspending.findOne({context: this.context, tags: "cip"})) {
        Taskspending.update({_id: this._id}, {$push: {wip: "contwip"}})
      }
      var projectid = Taskspending.findOne({project: this.project, tags: "largeroutcome"})._id
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
