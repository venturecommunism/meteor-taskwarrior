Meteor.subscribe("tasks")
Meteor.subscribe("taskspending")

Session.set('adding_category', false);
Session.set('adding_newtask', false);
Session.set('processing_task', false);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});



Template.list.tasks = function () {
  return Taskspending.find({status: "pending"}, {sort: {due: -1}})
}
Template.categories.new_cat = function () {
  return Session.equals('adding_category',true);
};
Template.categories.new_task = function () {
  return Session.equals('adding_newtask',true);
};

Template.categories.events({
  'click #btnNewCat': function (e, t) {
    Session.set('adding_category', true);
    Meteor.flush();
    focusText(t.find("#add-category"));
  },
  'click #btnNewTask': function (e, t) {
    Session.set('adding_newtask', true);
    Meteor.flush();
    focusText(t.find("#add-newtask"));
  },

  'keyup #add-category': function (e,t) {
    if (e.which === 13)
    {
      var catVal = String(e.target.value || "");
      if (catVal)
      {
        lists.insert({name:catVal,owner:Meteor.userId()});
        Session.set('adding_category', false);
      }
    }
  },

  'keyup #add-newtask': function (e,t) {
    if (e.which === 13)
    {
      var taskVal = String(e.target.value || "");
      if (taskVal)
      {
        addItem(lists.findOne({name:"Process"})._id,e.target.value);
        Session.set('adding_newtask', false);
       }
     }
  },

  'focusout #add-newtask' : function(e,t){
    Session.set('adding_newtask',false);
  },
  'focusout #add-category': function(e,t){
    Session.set('adding_category',false);
  },
  'click .category': selectCategory
});

Template.processingdialog.events({
  'focusout .processingdialog': function(e,t) {
     Session.set('processing_task',false);
   }
});
