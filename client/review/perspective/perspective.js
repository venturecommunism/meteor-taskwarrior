Template.perspective.events({
  'change .aorselect': function (e,t) {
    console.log(e.target.id)
    var projid = e.target.id.slice(10)
    console.log(projid)
    var selectValue = t.$("#aorselect-"+projid).val()
    console.log(selectValue)
    Taskspending.update({_id: projid}, {$set: {aor: selectValue}})
  },
})


Template.perspective.events({
  'click .closeperspectivesection': function(e,t){
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

Template.perspective.helpers({
  projects: function () {
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$ne: "aor"}}]}, {sort: {rank: 1}})
  },
  aor: function() {
    return Taskspending.find({tags: "aor"})
  },
  new_aor: function() {
    return Session.equals('editingaor', true)
  },
})

