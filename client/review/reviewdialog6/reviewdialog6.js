Template.reviewdialog6.reviewdialog6 = function () {
  return Session.get('review_dialog_6')
}

Template.reviewdialog6.events({
  'click #review6ok1': function (e, t) {
    Session.set('review_dialog_6',false)
    Session.set('review_dialog_7',true)
  },
  'click #review6end': function (e, t) {
    Session.set('review_dialog_6',false)
  }
})

Template.reviewdialog6.upcomingcalendar = function () {
  return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}},{due: {$exists: true}}, {context: {$exists: false}}]}, {sort: {due:1}})
  return Taskspending.find({status: {$in: ["completed", "waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due:1}})
}

