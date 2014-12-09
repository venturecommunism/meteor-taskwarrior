Template.reviewdialog8.reviewdialog8 = function () {
  return Session.get('review_dialog_8')
}

Template.reviewdialog8.events({
  'click #review8ok1': function (e, t) {
    Session.set('review_dialog_8',false)
    Session.set('review_dialog_9',true)
  },
  'click #review8end': function (e, t) {
    Session.set('review_dialog_8',false)
  }
})
