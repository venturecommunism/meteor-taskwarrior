Session.set('editing_item_largeroutcome', null);
Session.set('projopen', null);
Session.set('newdocument', null);
Session.set('newchecklist', null);

Template.project_item.helpers({
  documents: function () {
    return Taskspending.find({type: "textfile", project: this.project});
  },
  checklists: function () {
    return Taskspending.find({type: "checklist", project: this.project});
  },
  alarmsets: function () {
    return Taskspending.find({type: "alarmset", project: this.project});
  },
  new_document: function () {
    return Session.equals('newdocument', this.project)
  },
  new_checklist: function () {
    return Session.equals('newchecklist', this.project)
  },
  new_alarmset: function () {
    return Session.equals('newalarmset', this.project)
  },
  projopen: function () {
    return Session.equals('projopen', this.project)
  },
  project_has_largeroutcome: function () {
    var largeroutcome_systemtask = Taskspending.findOne({project: this.project, tags: "largeroutcome"})
    var returnvalue = largeroutcome_systemtask ? largeroutcome_systemtask.description : false
    return returnvalue
  },
  editing: function () {
    return Session.equals('editing_item_largeroutcome', this.project);
  },
  editing_defaultcontext: function () {
    return Session.equals('editing_defaultcontext',this.project)
  },
})

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
        var formattednow = formattedNow()
        var uuid = Taskspending.findOne({owner: Meteor.userId(), project: this.project, tags: "largeroutcome"}) ? Taskspending.findOne({owner: Meteor.userId(), project: this.project, tags: "largeroutcome"}).uuid : guid()
        console.log(Tasksbacklog.insert({owner: Meteor.userId(), project: this.project, description: largerOutcomeVal, tags: ["largeroutcome"], entry: formattednow, uuid:uuid}))
if (Taskspending.findOne({uuid: uuid})) {
        console.log(Taskspending.update({_id:Taskspending.findOne({owner: Meteor.userId(), project: this.project, tags: "largeroutcome"})._id},{$set:{description: largerOutcomeVal, entry: formattednow}}))
}
else {
console.log(Taskspending.insert({owner: Meteor.userId(), project: this.project, description: largerOutcomeVal, tags:["largeroutcome"], entry: formattednow}))
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
        Tasksbacklog.insert({owner: Meteor.userId(), description: e.target.value, entry: formattednow, status: "pending", type: "textfile", project: this.project, uuid: uuid})
        Taskspending.insert({owner: Meteor.userId(), description: e.target.value, entry: formattednow, status: "pending", type: "textfile", project: this.project, uuid: uuid})
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
  'click #btnNewAlarmset': function (e,t) {
    Session.set('newalarmset', this.project);
    Meteor.flush();
    focusText(t.find("#add-newalarmset"));
  },
  'keyup #add-newchecklist': function (e,t) {
    if (e.which === 13)
    {
      var checklistVal = String(e.target.value || "");
      if (checklistVal)
      {
        var formattednow = formattedNow()
        var uuid = guid()
        Tasksbacklog.insert({owner: Meteor.userId(), description: e.target.value, entry: formattednow, status: "pending", type: "checklist", project: this.project, uuid: uuid})
        Taskspending.insert({owner: Meteor.userId(), description: e.target.value, entry: formattednow, status: "pending", type: "checklist", project: this.project, uuid: uuid})
        Session.set('newchecklist', false);
       }
     }
  },
  'keyup #add-newalarmset': function (e,t) {
    if (e.which === 13)
    {
      var alarmsetVal = String(e.target.value || "");
      if (alarmsetVal)
      {
        var formattednow = formattedNow()
        var uuid = guid()
        Tasksbacklog.insert({owner: Meteor.userId(), description: e.target.value, entry: formattednow, status: "pending", type: "alarmset", project: this.project, uuid: uuid})
        Taskspending.insert({owner: Meteor.userId(), description: e.target.value, entry: formattednow, status: "pending", type: "alarmset", project: this.project, uuid: uuid})
        Session.set('newalarmset', false);
       }
     }
  },
  'click #btnDefaultContext': function (e,t) {
    Session.set('editing_defaultcontext', this.project);
    Meteor.flush();
    focusText(t.find("#editing-defaultcontext"));
  },
  'keyup #editing-defaultcontext': function (e,t) {
    if (e.which === 13)
    {
      var defaultContextVal = String(e.target.value || "");
      if (defaultContextVal)
      {
        var formattednow = formattedNow()
        Taskspending.update({_id:this._id}, {$set: {defaultcontext: e.target.value}})
        Session.set('editing_defaultcontext', false);
       }
     }
  },
  'focusout #editing-defaultcontext' : function(e,t){
    Session.set('editing_defaultcontext',false);
  },
  'click #btnArchiveProject': function (e,t) {
    var formattednow = formattedNow()
    Tasksbacklog.insert({owner: Meteor.userId(), description: this.description, entry: formattednow, status: "completed", type:"largeroutcome", project: this.project})
    Taskspending.remove({_id:this._id})
  },
  'focusout #add-newchecklist' : function(e,t){
    Session.set('newchecklist',false);
  },
  'focusout #add-newalarmset' : function(e,t){
    Session.set('newalarmset', false);
  }


});

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
};
