Template.reviewdialog10.reviewdialog10 = function () {
  return Session.get('review_dialog_10')
}

Template.reviewdialog10.events({
  'click #review10ok1': function (e, t) {
    Session.set('review_dialog_10',false)
    Session.set('review_dialog_11',true)
  },
  'click #review10end': function (e, t) {
    Session.set('review_dialog_10',false)
  }
})
