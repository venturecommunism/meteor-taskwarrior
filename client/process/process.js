Session.set('processing_task', false);

Template.process.events({
  'click #btnAddItem': function (e,t){
    Session.set('list_adding',true);
    Meteor.flush();
    focusText(t.find("#item_to_add"));
  },
  'keyup #item_to_add': function (e,t){
    if (e.which === 13)
      {
        addItem(Session.get('current_list'),e.target.value);
        Session.set('list_adding',false);
      }
  },
  'focusout #item_to_add': function(e,t){
//    Session.set('list_adding',false);
  },
  'click .delete_item': function(e,t){
    removeItem(e.target.id);
  },
  'click .project': function(e,t){
    Session.set('project_input',this.Name);
    Meteor.flush();
    focusText(t.find(".title"),this.project);

  },
  'click .startprocessing-button': selectTaskProcessing
});

Template.process.helpers({
  tasks: function () {
    formattednow = formattedNow()
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: "inbox"})
  },
  is_processing: function () {
    return Session.get('process_status')
  },
  waiting: function () {
    if (!this.wait) {
      return false
    }
    var formattednow = formattedNow()
    var string = this.wait
    var string = string.split("T")[0] + string.split("T")[1]
    var string = string.split("Z")[0]
    if (string > formattednow) {
    }
    return (string > formattednow)
  },
})
