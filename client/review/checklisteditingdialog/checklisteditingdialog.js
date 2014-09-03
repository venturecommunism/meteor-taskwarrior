Template.checklisteditingdialog.checklisttitle = function () {
  return Taskspending.findOne({_id: Session.get('checklistediting')}).description
}

Template.checklisteditingdialog.payload = function () {
  return Taskspending.findOne({_id: Session.get('checklistediting')}).payload
}

Template.checklisteditingdialog.events({
  'click .modal .savebutton': function (e,t) {
    Taskspending.update({_id: Session.get('checklistediting')}, {$set: {payload: t.findAll('.modal textarea')[0].value}})
  },
  'click .checklisteditclose': function (e,t) {
    Session.set('checklistediting',false)
  }
});
