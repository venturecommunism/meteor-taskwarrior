Meteor.subscribe("tasks")
Meteor.subscribe("taskspending", function () {

if (!Session.get("do_context")) {

cursor = Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due:1}})

cursor.forEach(function (entry) {
  var clock, interval, timeLeft;

var formattednow = formattedNow()
var newstringparts = entry.due.substring(0,4) + "-" + entry.due.substring(4,6) + "-" + entry.due.substring(6,8) + "-" + entry.due.substring(9,11) + "-" + entry.due.substring(11,13) + "-" + entry.due.substring(13,15)
var newformattednow = formattednow.substring(0,4) + "-" + formattednow.substring(4,6) + "-" + formattednow.substring(6,8) + "-" + formattednow.substring(9,11) + "-" + formattednow.substring(11,13) + " " + formattednow.substring(13,15)
console.log('duedate')
console.log(newstringparts)
console.log('newformattednow')
console.log(newformattednow)
var momentone = moment(newstringparts, "YYYY-MM-DD-HH-mm-ss")
var momenttwo = moment(newformattednow, "YYYY-MM-DD-HH-mm-ss")
console.log(momentone)
console.log(momenttwo)
var diff = momentone.diff(momenttwo, 'seconds')
console.log('grand total is')
console.log(diff)




console.log('entry is ' + entry.due)
console.log(moment())
  clock = diff;

  var uuid = entry.uuid

  timeLeft = function() {
    if (clock > 0) {
      clock--;
var days = parseInt(clock / 86400)
var hours = parseInt((clock - days * 86400) / 3600)
var minutes = parseInt((clock - days * 86400 - hours * 3600) / 60)
var seconds = clock % 60
      Session.set("timer-" + uuid, days + " days " + hours + ":" + minutes + ":" + seconds);
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
