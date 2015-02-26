Template.reviewdialog5.reviewdialog5 = function () {
  return Session.get('review_dialog_5')
}

Template.reviewdialog5.events({
  'click #review5ok1': function (e, t) {
    Session.set('review_dialog_5',false)
    Session.set('review_dialog_6',true)
  },
  'click #review5end': function (e, t) {
    Session.set('review_dialog_5',false)
  }
})

Template.reviewdialog5.pastcalendar = function () {
  return Tasksbacklog.find({status: {$in: ["completed"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}},{due: {$exists: true}}, {context: {$exists: false}}]}, {sort: {due:-1}})
  return Taskspending.find({status: {$in: ["completed", "waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due:1}})
}
