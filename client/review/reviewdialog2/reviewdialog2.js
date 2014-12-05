Template.reviewdialog2.reviewdialog2 = function () {
  return Session.get('review_dialog_2')
}

Template.reviewdialog2.events({
  'click #review2ok1': function (e, t) {
console.log('you clicked 2 ok')
    Session.set('review_dialog_2',false)
    Session.set('review_dialog_3',true)
  },
  'click #review2end': function (e, t) {
    Session.set('review_dialog_2',false)
  }
})
