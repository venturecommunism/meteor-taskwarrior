Session.set('editing_item_largeroutcome', null);

Template.project_item2.helpers({
  project_has_largeroutcome: function () {
    var largeroutcome_systemtask = Taskspending.findOne({project: this.project, tags: "largeroutcome"})
    var returnvalue = largeroutcome_systemtask ? largeroutcome_systemtask.description : false
    return returnvalue
  },
  editing: function () {
    return Session.equals('editing_item_largeroutcome', this.project);
  },
})

Template.project_item2.events({
  'dblclick .project-item': function (e, t) {
    Session.set('editing_item_largeroutcome', this.project);
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("todo-input");
  },
  'focusout #project-input': function (e, t) {
    Session.set('editing_item_largeroutcome', null);
//    Meteor.flush();
  },
  'keyup #project-input': function (e,t) {
    if (e.which === 13)
    {
      var largerOutcomeVal = String(e.target.value || "");
      if (largerOutcomeVal)
      {
        var formattednow = formattedNow()
        var uuid = Taskspending.findOne({project: this.project, tags: "largeroutcome"}) ? Taskspending.findOne({project: this.project, tags: "largeroutcome"}).uuid : guid()
        Tasksbacklog.insert({owner: Meteor.userId(), project: this.project, description: largerOutcomeVal, tags: "largeroutcome", entry: formattednow, uuid:uuid})
      if (Taskspending.findOne({uuid: uuid})) {
        Taskspending.update({_id:Taskspending.findOne({owner: Meteor.userId(), project: this.project, tags: "largeroutcome"})._id},{$set:{description: largerOutcomeVal, entry: formattednow}})
    }
    else {
      Taskspending.insert({owner: Meteor.userId(), project: this.project, description: largerOutcomeVal, tags:"largeroutcome", entry: formattednow})
}
        Session.set('editing_item_largeroutcome', null);
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
