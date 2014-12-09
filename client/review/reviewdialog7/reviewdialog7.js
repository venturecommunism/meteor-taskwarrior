Template.reviewdialog7.reviewdialog7 = function () {
  return Session.get('review_dialog_7')
}

Template.reviewdialog7.events({
  'click #review7ok1': function (e, t) {
    Session.set('review_dialog_7',false)
    Session.set('review_dialog_8',true)
  },
  'click #review7end': function (e, t) {
    Session.set('review_dialog_7',false)
  }
})
