Meteor.subscribe("tasks")
Meteor.subscribe("taskspending")
Meteor.subscribe("tasksbacklog")

Session.set('adding_category', false);
Session.set('adding_newtask', false);
Session.set('processing_task', false);

Session.set('process_status', true);
Session.set('organize_status', false);
Session.set('review_status', false);
Session.set('do_status', false);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});


now = moment()
var formattednow = now.format('YYYYMMDD') + 'T' + now.format('HHmmss') + 'Z'
console.log('formatted is ' + formattednow)

Template.list.tasks = function () {
  return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: "inbox", waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.organize.tasks = function () {
  return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: "somedaymaybe", waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.categories.process_status = function () {
  return Session.equals('process_status',true) ? 'active' : ''
}
Template.categories.organize_status = function () {
  return Session.equals('organize_status',true) ? 'active' : ''
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

Template.list.is_processing = function () {
  return Session.get('process_status')
}
Template.organize.is_organizing = function () {
  return Session.get('organize_status')
}

Template.categories.events({
  'click #process': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', false);
    Session.set('do_status', false);
    Session.set('process_status', true) 
  },
  'click #organize': function (e, t) {
    Session.set('organize_status', true);
    Session.set('review_status', false);
    Session.set('do_status', false);
    Session.set('process_status', false)
  },
  'click #review': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', true);
    Session.set('do_status', false);
    Session.set('process_status', false)
  },
  'click #do': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', false);
    Session.set('do_status', true);
    Session.set('process_status', false)
  },

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
