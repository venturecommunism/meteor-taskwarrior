Template.reviewdialog9.reviewdialog9 = function () {
  return Session.get('review_dialog_9')
}

Template.reviewdialog9.events({
  'click #review9ok1': function (e, t) {
    Session.set('review_dialog_9',false)
    Session.set('review_dialog_10',true)
  },
  'click #review9end': function (e, t) {
    Session.set('review_dialog_9',false)
  }
})
