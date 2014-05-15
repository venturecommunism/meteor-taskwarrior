Session.set('adding_newtask', false);

Template.categories.new_task = function () {
  return Session.equals('adding_newtask',true);
};

Template.categories.events({ 
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
        var now = moment()
        var formattednow = now.format('YYYYMMDD') + 'T' + now.format('HHmmss') + 'Z'
        Meteor.call("uuid",function(error,result){
          var uuid = result
          Tasksbacklog.insert({description: e.target.value, entry: formattednow, status: "pending", tags: ['inbox'], uuid: uuid})
          Taskspending.insert({description: e.target.value, entry: formattednow, status: "pending", tags: ['inbox'], uuid: uuid})
          Session.set('adding_newtask', false);
        });
       }
     }
  },
  'focusout #add-newtask' : function(e,t){
    Session.set('adding_newtask',false);
  }
})

//////////Generic Helper Functions///////////
//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();
};
