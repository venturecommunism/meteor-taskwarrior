Template.projectprocessor.helpers({
  largeroutcome: function() {
    var aor = this.project
    var aorid = Taskspending.findOne({project: aor, tags: "largeroutcome"})._id
    return Taskspending.find({tags: "largeroutcome", aor: aorid}, {sort: {rank:1}})
  },
  weeklyreviewbuttonactive: function () {
    if (Taskspending.findOne({_id: this._id, tags: "aorfocus"})){
      return 'btn-inverse'
    }
  },
  projinboxcount: function () {
    if (Session.equals("energylevel", "calendaronly") && Taskspending.findOne({project: this.project, tags: "projinbox"})) {
      return 'btn-danger'
    }
  },
})

Template.projectprocessor.events({
  'click .weeklyreview': function(e,t) {
    var taskid = e.currentTarget.id
    var project = Taskspending.findOne({_id: this._id}).project
    Taskspending.update({_id: taskid}, {$set: {project: project}})
    Taskspending.update({_id: taskid}, {$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: taskid}, {$push: {tags: "projinbox"}})
    console.log(Taskspending.findOne({_id: e.currentTarget.id}).description)
    console.log(Taskspending.findOne({_id: this._id}).project)
  },
  'keyup #newproj': function(e,t) {
    if (e.which === 13) {
    var formattednow = formattedNow()
      if (Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}})) {
        var rank = Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}}).rank - 1
      }
      else {
        var rank = 0
      }
      console.log(e.target.value)
      Taskspending.insert({project: e.target.value, owner: Meteor.userId(), entry: formattednow, tags: "largeroutcome", rank: rank})
    }
  },
})
