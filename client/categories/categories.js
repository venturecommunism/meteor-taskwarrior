Session.set('adding_newtask', false);

now = moment()
var formattednow = now.format('YYYYMMDD') + 'T' + now.format('HHmmss') + 'Z'
console.log('formatted is ' + formattednow)

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

Template.categories.events({
  'click #process': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', false);
    Session.set('do_status', false);
    Session.set('process_status', true)
  },
  'click #organize': function (e, t) {
    Session.set('organize_status', true);
    Session.set('review_status', false);
    Session.set('do_status', false);
    Session.set('process_status', false)
  },
  'click #review': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', true);
    Session.set('do_status', false);
    Session.set('process_status', false)
  },
  'click #do': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', false);
    Session.set('do_status', true);
    Session.set('process_status', false)
  },
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
        addItem(lists.findOne({name:"Process"})._id,e.target.value);
        Session.set('adding_newtask', false);
       }
     }
  },

  'focusout #add-newtask' : function(e,t){
    Session.set('adding_newtask',false);
  },
// 'click .category': selectCategory
});

Template.categories.process_status = function () {
  return Session.equals('process_status',true) ? 'active' : ''
}
Template.categories.organize_status = function () {
  return Session.equals('organize_status',true) ? 'active' : ''
}
Template.categories.review_status = function () {
  return Session.equals('review_status',true) ? 'active' : ''
}
Template.categories.do_status = function () {
  return Session.equals('do_status',true) ? 'active' : ''
}
Template.categories.new_task = function () {
  return Session.equals('adding_newtask',true);
};

//////////Generic Helper Functions///////////
//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();
};
