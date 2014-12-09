Template.reviewdialog11.reviewdialog11 = function () {
  return Session.get('review_dialog_11')
}

Template.reviewdialog11.events({
  'click #review11ok1': function (e, t) {
    Session.set('review_dialog_11',false)
    Session.set('review_dialog_12',true)
  },
  'click #review11end': function (e, t) {
    Session.set('review_dialog_11',false)
  }
})
