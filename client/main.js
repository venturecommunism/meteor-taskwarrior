if (Notification.permission !== "granted") {
  Notification.requestPermission(function (status) {
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
  })
}


/*
// this collaborative scroll position code was slowing down the client too much
Meteor.subscribe("scrollpos")



Tracker.autorun( function () {

var scrollposcursor = Taskspending.find({type: "scrollpos"})
var scrollpos = Taskspending.findOne({type: "scrollpos"})
if (scrollposcursor.count() == 1) {
window.scrollTo(0, scrollpos.yval)
} else if (scrollposcursor.count() >= 1) {
  Taskspending.find({type: "scrollpos"}).forEach( function (doc) {
    Taskspending.remove({_id: doc._id})
  })
  window.scrollTo(0, scrollpos.yval)
}

$(window).scroll(function () {
Meteor.setTimeout(function () {
var ytop = window.pageYOffset || document.documentElement.scrollTop
var scrollid = Taskspending.findOne({type: "scrollpos"}) ? Taskspending.findOne({type: "scrollpos"})._id : false
if (scrollid) {
  Taskspending.update({_id: scrollid}, {$set: {yval: ytop}})
  var yval = Taskspending.findOne({_id: scrollid}).yval
  window.scrollTo(0, yval)
  console.log(yval)
} else {
  Taskspending.insert({type: "scrollpos", yval: ytop, owner: Meteor.userId()})
  var scrollid = Taskspending.findOne({type: "scrollpos", owner: Meteor.userId()})._id
  var yval = Taskspending.findOne({_id: scrollid}).yval
  window.scrollTo(0, yval)
  console.log(yval)
}
}, 1000)
})

})

*/

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
Meteor.subscribe('taskspendinglowestranked')

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
