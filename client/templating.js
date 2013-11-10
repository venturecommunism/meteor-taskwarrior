Meteor.subscribe("tasks")
Meteor.subscribe("taskspending")
Meteor.subscribe("tasksbacklog")

Session.set('adding_category', false);
Session.set('adding_newtask', false);
Session.set('processing_task', false);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});


now = moment()
var formattednow = now.format('YYYYMMDD') + 'T' + now.format('HHmmss') + 'Z'
console.log('formatted is ' + formattednow)

Template.list.tasks = function () {
  return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: "inbox", waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.categories.new_cat = function () {
  return Session.equals('adding_category',true);
};
Template.categories.new_task = function () {
  return Session.equals('adding_newtask',true);
};

Template.list.waiting = function () {
  if (!this.wait) {
    return false
  }
  now = moment()
  var formattednow = now.format('YYYYMMDD') + now.format('HHmmss')
  string = this.wait
  string = string.split("T")[0] + string.split("T")[1]
  string = string.split("Z")[0]
  if (string > formattednow) {
    console.log(string)    
    console.log(string + 'str was greater than formattednow for ' + this.description)
  }
  console.log(this.description + string > formattednow)
  return (string > formattednow)
}



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
//  'click .category': selectCategory
});

Template.processingdialog.events({
  'click .modal .cancel': function(e,t) {
     Session.set('processing_task',false);
   }
});
