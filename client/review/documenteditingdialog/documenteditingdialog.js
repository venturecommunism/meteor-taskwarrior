Template.documenteditingdialog.helpers({
  doctitle: function () {
    return Taskspending.findOne({_id: Session.get('documentediting')}).description
  },
  payload: function () {
    return Taskspending.findOne({_id: Session.get('documentediting')}).payload
  },
})

Template.documenteditingdialog.events({
  'click .modal .savebutton': function (e,t) {
    Taskspending.update({_id: Session.get('documentediting')}, {$set: {payload: t.findAll('.modal textarea')[0].value}})
  },
  'click .doceditclose': function (e,t) {
    Session.set('documentediting',false)
  }
});
