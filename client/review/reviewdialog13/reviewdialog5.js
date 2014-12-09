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
