Template.aorunprocessor.helpers({
  aor: function() {
    return Taskspending.find({tags: "aor"}, {sort: {rank:1}})
  },
  weeklyreviewbuttonactive: function () {
    if (Taskspending.findOne({_id: this._id, tags: "aorfocus"})){
      return 'btn-inverse'
    }
  },
})

Template.aorunprocessor.events({
  'click .weeklyreview': function(e,t) {
    var taskid = e.currentTarget.id
    var project = Taskspending.findOne({_id: this._id}).project
    Taskspending.update({_id: taskid}, {$set: {project: project}})
    console.log(Taskspending.findOne({_id: e.currentTarget.id}).description)
    console.log(Taskspending.findOne({_id: this._id}).project)
  },
  'keyup #newaor': function(e,t) {
    if (e.which === 13) {
    var formattednow = formattedNow()
      if (Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}})) {
        var rank = Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}}).rank - 1
      }
      else {
        var rank = 0
      }
      console.log(e.target.value)
      Taskspending.insert({project: "AOR."+e.target.value, description: e.target.value, owner: Meteor.userId(), entry: formattednow, tags: ['largeroutcome', 'aor'], rank: rank})
    }
  },
})
