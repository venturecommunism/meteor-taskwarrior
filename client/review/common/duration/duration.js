Template.duration.helpers({
  editingduration: function() {
    return Session.equals('editing_duration', this._id)
  },
  iscalitem: function () {
    if (Taskspending.findOne({_id: this._id, due: {$exists: 1}})) {
      return true
    }
  },
  hasduration: function () {
    if (Taskspending.findOne({_id: this._id, duration: {$exists: 1}})) {
      return true
    }
  }
})

Template.duration.events({
  'dblclick .duration-item': function (e, t) {
    Session.set('editing_duration', this._id)
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("duration-input")
  },
  'focusout #duration-input': function (e, t) {
    Session.set('editing_duration', null)
    Meteor.flush()
  },
  'keyup #duration-input': function (e,t) {
    if (e.which === 13)
    {
      var taskVal = String(e.target.value || "");
      if (taskVal)
      {
        var formattednow = formattedNow()
        var durVal = "PT" + taskVal + "M"
        Taskspending.update({_id:this._id},{$set:{duration: durVal, entry: formattednow}})
        Session.set('editing_itemname', null);
       }
     }
  },
})
