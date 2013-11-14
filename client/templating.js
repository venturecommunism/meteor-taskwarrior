Meteor.subscribe("tasks")
Meteor.subscribe("taskspending")
Meteor.subscribe("tasksbacklog")

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
  var project_filter = Session.get('project_filter');
  if (project_filter)
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}], waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.organize.tasks2 = function () {
  var project_filter = Session.get('project_filter');
  if (project_filter)
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$not: "inbox"}}, {tags: {$not: "mit"}}], waiting: { $lt: formattednow}}, {sort: {due: -1}})
//      Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, tags: {$ne: "inbox"}, tags: "mit", waiting: { $lt: formattednow}}, {sort: {due: -1}}),
//      Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, tags: {$ne: ["inbox", "mit"]}, waiting: { $lt: formattednow}}, {sort: {due: -1}}),
  else
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: {$not: "inbox"}, waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.do.tasks = function () {
console.log(Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}], waiting: { $lt: formattednow}}, {sort: {due: -1}}) + "this is some text")
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}], waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.categories.process_status = function () {
  return Session.equals('process_status',true) ? 'active' : ''
}
Template.categories.organize_status = function () {
  return Session.equals('organize_status',true) ? 'active' : ''
}
Template.categories.review_status = function () {
  return Session.equals('review_status',true) ? 'active' : ''
}
Template.categories.do_status = function () {
  return Session.equals('do_status',true) ? 'active' : ''
}
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
Template.do.is_doing = function () {
  return Session.get('do_status')
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
  'click #btnNewTask': function (e, t) {
    Session.set('adding_newtask', true);
    Meteor.flush();
    focusText(t.find("#add-newtask"));
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
//  'click .category': selectCategory
});

Template.processingdialog.events({
  'click .modal .cancel': function(e,t) {
     Session.set('processing_task',false);
   }
});
