Meteor.subscribe("tasks")
Meteor.subscribe("taskspending")
Meteor.subscribe("tasksbacklog")

Session.set('adding_newtask', false);
Session.set('processing_task', false);

Session.setDefault('process_status', false);
Session.setDefault('organize_status', false);
Session.setDefault('review_status', false);
Session.setDefault('do_status', true);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
