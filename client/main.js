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
