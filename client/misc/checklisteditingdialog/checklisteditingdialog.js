Template.checklisteditingdialog.helpers({
  tasks: function () {
    var checklistediting = Taskspending.findOne({_id: Session.get('checklistediting')})
    if (checklistediting) {
      return Taskspending.find({checked: "no", checklistid: checklistediting._id, project: checklistediting.project, type: "checklistitem"})
    }
  },
  tasks2: function () {
    var checklistediting = Taskspending.findOne({_id: Session.get('checklistediting')})
    if (checklistediting) {
      return Taskspending.find({checked: "yes", checklistid: checklistediting._id, project: checklistediting.project, type: "checklistitem"})
    }
  },
  checklisttitle: function () {
    var checklisttitle = Taskspending.findOne({_id: Session.get('checklistediting')})
    if (checklisttitle) {
    return checklisttitle.description
    }
  },
  payload: function () {
    return Taskspending.findOne({_id: Session.get('checklistediting')}).payload
  },
})

Template.checklisteditingdialog.events({
  'click .checklisteditclose': function (e,t) {
    Session.set('checklistediting',false)
  },
  'keyup .newtask-checklist #add-newtask-checklist': function (e,t) {
    if (e.which === 13) {
      var checklistediting = Taskspending.findOne({_id: Session.get('checklistediting')})
      Taskspending.insert({owner: Meteor.userId(), checked: "yes", checklistid: checklistediting._id, type: "checklistitem", description: e.target.value, project: checklistediting.project})
    }  
  },
  'keyup .newtask-checklist #add-newtask-context-checklist': function (e,t) {
  }


})
