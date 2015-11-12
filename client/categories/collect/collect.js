Session.set('adding_newtask', false);

//test to see whether to render the collect input
Template.collect.helpers({
  new_task: function () {
    return Session.equals('adding_newtask',true);
  },
})

//events for the collect template
Template.collect.events({
  'click #btnNewTask': function (e, t) {
    Session.set('adding_newtask', true);
    Meteor.flush();
    focusText(t.find("#add-newtask"));
  },
  'keyup #add-newtask': function (e,t) {
    if (e.which === 13)
    {
      var taskVal = String(e.target.value || "");
      if (taskVal)
      {
        var formattednow = formattedNow()
        var uuid = guid()
        if (Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}})) {
          var rank = Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}}).rank - 1
        }
        else {
          var rank = 0
        }
        Tasksbacklog.insert({description: e.target.value, owner: Meteor.userId(), entry: formattednow, status: "pending", tags: ['inbox'], uuid: uuid, rank: rank, energylevel: 4})
        Taskspending.insert({description: e.target.value, owner: Meteor.userId(), entry: formattednow, status: "pending", tags: ['inbox'], uuid: uuid, rank: rank, energylevel: 4})
        Session.set("gtdmode", "reviewmode")
        Session.set("energylevel", "calendaronly")
        Session.set('adding_newtask', false);
       }
     }
  },
  'focusout #add-newtask' : function(e,t){
    Session.set('adding_newtask',false);
  }
})
