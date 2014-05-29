Session.set('adding_newtask', false);

//test to see whether to render the collect input
Template.collect.new_task = function () {
  return Session.equals('adding_newtask',true);
};

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
        Tasksbacklog.insert({description: e.target.value, entry: formattednow, status: "pending", tags: ['inbox'], uuid: uuid})
        Taskspending.insert({description: e.target.value, entry: formattednow, status: "pending", tags: ['inbox'], uuid: uuid})
        Session.set('adding_newtask', false);
        Toast.success('Collected a task', 'Daily Review', {displayDuration: 5000});
       }
     }
  },
  'focusout #add-newtask' : function(e,t){
    Session.set('adding_newtask',false);
  }
})
