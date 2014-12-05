Template.reviewdialog3.reviewdialog3 = function () {
  return Session.get('review_dialog_3')
}

Template.reviewdialog3.events({
  'click #review3ok1': function (e, t) {
    Session.set('review_dialog_3',false)
    Session.set('review_dialog_4',true)
  },
  'click #review3end': function (e, t) {
    Session.set('review_dialog_3',false)
  }
})
