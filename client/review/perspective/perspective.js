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

Schemas = {}

Schemas.SelectAor = new SimpleSchema({
  aor: {
    type: String
  }
})

Template.perspective.helpers({
  options: function () {
    return Taskspending.find({tags: "aor"}).map(function (c) {
      return {label: c.description, value: c.description}
    })
  }
})
