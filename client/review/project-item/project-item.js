Session.set('editing_item_largeroutcome', null);
Session.set('projopen', null);
Session.set('newdocument', null);
Session.set('newchecklist', null);

Template.project_item.documents = function () {
  return Taskspending.find({type: "textfile", project: this.project});
}

Template.project_item.checklists = function () {
  return Taskspending.find({type: "checklist", project: this.project});
}

Template.project_item.new_document = function () {
  return Session.equals('newdocument', this.project)
}

Template.project_item.new_checklist = function () {
  return Session.equals('newchecklist', this.project)
}

Template.project_item.projopen = function () {
  return Session.equals('projopen', this.project)
}

Template.project_item.project_has_largeroutcome = function () {
  var largeroutcome_systemtask = Taskspending.findOne({project: this.project, tags: "largeroutcome"})
  var returnvalue = largeroutcome_systemtask ? largeroutcome_systemtask.description : false
  return returnvalue
};

Template.project_item.editing = function () {
  return Session.equals('editing_item_largeroutcome', this.project);
};

Template.project_item.events({
  'dblclick .project-item': function (e, t) {
//    alert('Hi');
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
console.log("did something")
        var formattednow = formattedNow()
        var uuid = Taskspending.findOne({project: this.project, tags: "largeroutcome"}) ? Taskspending.findOne({project: this.project, tags: "largeroutcome"}).uuid : guid()
console.log(uuid)
        console.log(Tasksbacklog.insert({project: this.project, description: largerOutcomeVal, tags: ["largeroutcome"], entry: formattednow, uuid:uuid}))
if (Taskspending.findOne({uuid: uuid})) {
        console.log(Taskspending.update({_id:Taskspending.findOne({project: this.project, tags: "largeroutcome"})._id},{$set:{description: largerOutcomeVal, entry: formattednow}}))
}
else {
console.log(Taskspending.insert({project: this.project, description: largerOutcomeVal, tags:["largeroutcome"], entry: formattednow}))
}
        Session.set('editing_item_largeroutcome', null);
       }
     }
  },
  'click #btnNewDocument': function (e,t) {
    Session.set('newdocument', this.project);
    Meteor.flush();
    focusText(t.find("#add-newdocument"));
  },
  'keyup #add-newdocument': function (e,t) {
    if (e.which === 13)
    {
      var documentVal = String(e.target.value || "");
      if (documentVal)
      {
        var formattednow = formattedNow()
        var uuid = guid()
        Tasksbacklog.insert({description: e.target.value, entry: formattednow, status: "pending", type: "textfile", project: this.project, uuid: uuid})
        Taskspending.insert({description: e.target.value, entry: formattednow, status: "pending", type: "textfile", project: this.project, uuid: uuid})
        Session.set('newdocument', false);
       }
     }
  },
  'focusout #add-newdocument' : function(e,t){
    Session.set('newdocument',false);
  },
  'click #btnNewChecklist': function (e,t) {
    Session.set('newchecklist', this.project);
    Meteor.flush();
    focusText(t.find("#add-newchecklist"));
  },
  'keyup #add-newchecklist': function (e,t) {
    if (e.which === 13)
    {
      var checklistVal = String(e.target.value || "");
      if (checklistVal)
      {
        var formattednow = formattedNow()
        var uuid = guid()
        Tasksbacklog.insert({description: e.target.value, entry: formattednow, status: "pending", type: "checklist", project: this.project, uuid: uuid})
        Taskspending.insert({description: e.target.value, entry: formattednow, status: "pending", type: "checklist", project: this.project, uuid: uuid})
        Session.set('newchecklist', false);
       }
     }
  },
  'focusout #add-newchecklist' : function(e,t){
    Session.set('newchecklist',false);
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
