Template.easyhard.helpers({
  hasenergylevelone: function () {
    if (this.energylevel == 1) {
      return true
    }
  },
  hasenergyleveltwo: function () {
    if (this.energylevel == 2) { 
      return true
    }
  },
  hasenergylevelsix: function () {
    if (this.energylevel == 6) { 
      return true
    }
  },
  hasenergylevelseven: function () {
    if (this.energylevel == 7) { 
      return true
    }
  },
  hasenergylevel: function () {
    if (this.energylevel) {
      return true
    }
  },
})

Template.easyhard.events({
  'click .sendtoenergyone': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 1}})
  },
  'click .sendtoenergytwo': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 2}})
  },
  'click .sendtoenergythree': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 3}})
  },
  'click .sendtoenergyfour': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 4}})
  },
  'click .sendtoenergyfive': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 5}})
  },
  'click .sendtoenergysix': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 6}})
  },
  'click .sendtoenergyseven': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 7}})
  },
})
