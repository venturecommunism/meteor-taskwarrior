Meteor.startup(function () {
  Session.set('tasks_dataloaded', false)
  Session.set('taskspending_dataloaded', false)
  Session.set('tasksbacklog_dataloaded', false)
})

//Meteor.subscribe("tasks")

/*
Meteor.subscribe("taskspending", function () {

Session.set('taskspending_dataloaded', true)
})
*/

Meteor.subscribe('taskspendingcontextpicker')
Meteor.subscribe('taskspendingprojects')
Meteor.subscribe('taskspendingsomedaymaybeprojects')

//Meteor.subscribe("tasksbacklog")

Session.set('adding_newtask', false);
Session.set('processing_task', false);

Session.setDefault('process_status', false);
Session.setDefault('organize_status', false);
Session.setDefault('review_status', true);
Session.setDefault('do_status', false);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
