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
