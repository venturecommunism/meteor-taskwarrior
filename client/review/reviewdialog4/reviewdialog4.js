Template.reviewdialog4.reviewdialog4 = function () {
  return Session.get('review_dialog_4')
}

Template.reviewdialog4.events({
  'click #review4ok1': function (e, t) {
    Session.set('review_dialog_4',false)
    Session.set('review_dialog_5',true)
  },
  'click #review4end': function (e, t) {
    Session.set('review_dialog_4',false)
  }
})
