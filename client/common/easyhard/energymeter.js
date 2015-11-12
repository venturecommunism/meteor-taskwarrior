Template.energymeter.helpers({
  oneselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 1) {
      return 'btn-primary'
    }
  },
  twoselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 2) {
      return 'btn-primary'
    }
  },
  threeselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 3) {
      return 'btn-primary'
    }
  },
  fourselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 4) {
      return 'btn-primary'
    }
  },
  fiveselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 5) {
      return 'btn-primary'
    }
  },
  sixselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 6) {
      return 'btn-primary'
    }
  },
  sevenselected: function () {
    if (Taskspending.findOne({_id: this._id}).energylevel && Taskspending.findOne({_id: this._id}).energylevel == 7) {
      return 'btn-primary'
    }
  },
})

//couldn't templatize the energymeter and the energyfilter into one thing because can't listen to events outside the template - maybe it can be embedded in another template

Template.energymeter.events({
  'click .energy0': function () {
  },
  'click .energy1': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 1}})
  },
  'click .energy2': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 2}})
  },
  'click .energy3': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 3}})
  },
  'click .energy4': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 4}})
  },
  'click .energy5': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 5}})
  },
  'click .energy6': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 6}})
  },
  'click .energy7': function () {
    Taskspending.update({_id: this._id}, {$set: {energylevel: 7}})
  },
})
