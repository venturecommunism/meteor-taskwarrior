Template.horizoninfocus.events({
  'change .aorselect': function (e,t) {
    console.log(e.target.id)
    var projid = e.target.id.slice(10)
    console.log(projid)
    var selectValue = t.$("#aorselect-"+projid).val()
    console.log(selectValue)
    Taskspending.update({_id: projid}, {$set: {aor: selectValue}})
  },
  'click .aortoback': function (e,t) {
    var highestaor = Taskspending.findOne({tags: "aor"}, {sort: {rank: -1}}).rank
    var currentaor = Taskspending.findOne({_id: this._id}).rank
    if (currentaor >= highestaor) {
    }
    else {
      var newrank = highestaor + 1
      Taskspending.update({_id: this._id}, {$set: {rank: newrank}})
    }
  },
  'click .aortofront': function (e,t) {
    var lowestaor = Taskspending.findOne({tags: "aor"}, {sort: {rank: 1}}).rank
    var currentaor = Taskspending.findOne({_id: this._id}).rank
    if (currentaor <= lowestaor) {
    }
    else {
      var newrank = lowestaor - 1
      Taskspending.update({_id: this._id}, {$set: {rank: newrank}})
    }
  },
  'click .aorfocus': function (e,t) {
    Taskspending.update({_id: this._id}, {$pull: {tags: "aorfocus"}})
  },
})


Template.horizoninfocus.events({
  'click .closehorizoninfocussection': function(e,t){
    Session.set('perspectivehidden', true)
  },
  'click .newaor.btn': function(e,t){
    Session.set('editingaor', true)
    Meteor.flush()
    focusText(t.find("#add-newaor"))
  },
  'focusout #add-newaor': function(e,t){
    Session.set('editingaor', false)
  },
  'keyup #add-newaor': function (e,t) {
    if (e.which === 13)
    {
      var aorVal = String(e.target.value || "");
      if (aorVal)
      {
        var formattednow = formattedNow()
        if (Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}})) {
          var rank = Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}}).rank - 1
        }
        else {
          var rank = 0
        }
        Tasksbacklog.insert({description: e.target.value, owner: Meteor.userId(), entry: formattednow, tags: ['largeroutcome', 'aor'], rank: rank})
        Taskspending.insert({description: e.target.value, owner: Meteor.userId(), entry: formattednow, tags: ['largeroutcome', 'aor'], rank: rank})
        Session.set('editingaor', false);
       }
     }
  },
})

Template.horizoninfocus.helpers({
  aor: function() {
    return Taskspending.find({tags: "aorfocus"}, {sort: {rank: 1}})
  },
  aorprojects: function () {
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {aor: this._id}, {tags: {$ne: "aor"}}]}, {sort: {rank: 1}})
  },
})

