Template.reviewdialog12.reviewdialog12 = function () {
  return Session.get('review_dialog_12')
}

Template.reviewdialog12.events({
  'click #review12ok1': function (e, t) {
    Session.set('review_dialog_12',false)
    Session.set('review_dialog_13',true)
  },
  'click #review12end': function (e, t) {
    Session.set('review_dialog_12',false)
  }
})
