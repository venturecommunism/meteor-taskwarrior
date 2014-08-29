Meteor.subscribe("tasks")
Meteor.subscribe("taskspending", function () {

if (!Session.get("do_context")) {

cursor = Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due:1}})

cursor.forEach(function (entry) {
  var clock, interval, timeLeft;

console.log('entry is ' + entry.due)
console.log(moment())
  clock = 10;

  var uuid = entry.uuid

  timeLeft = function() {
    if (clock > 0) {
      clock--;
      Session.set("timer-" + uuid, clock);
      return console.log(clock);
    } else {
      console.log("That's All Folks");
      return Meteor.clearInterval(interval);
    }
  };

  interval = Meteor.setInterval(timeLeft, 1000);
})

}



})
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
