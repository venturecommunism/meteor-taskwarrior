Template.reviewdialog1.reviewdialog1 = function () {
  return Session.get('review_dialog_1')
}

Template.reviewdialog1.events({
  'click #review1ok1': function (e, t) {
    Session.set('review_dialog_1',false)
    Session.set('review_dialog_2',true)
  },
})
