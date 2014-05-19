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
  'keyup .title': function (e,t){
    if (e.which === 13)
      {
        projecttask = Taskspending.findOne({_id: Session.get('current_processedtask')})
        projecttask.project = e.target.value
        Tasksbacklog.insert(projecttask)
        Taskspending.update({_id: this._id},{$set:{project:e.target.value}})     
      }
  },
  'click .startprocessing-button': selectTaskProcessing
});

Template.process.is_processing = function () {
  return Session.get('process_status')
}

Template.process.waiting = function () {
  if (!this.wait) {
    return false
  }
  var formattednow = formattedNow()
  var string = this.wait
  var string = string.split("T")[0] + string.split("T")[1]
  var string = string.split("Z")[0]
  if (string > formattednow) {
    console.log(string)
    console.log(string + 'str was greater than formattednow for ' + this.description)
  }
  console.log(this.description + string > formattednow)
  return (string > formattednow)
}

Template.process.tasks = function () {
  formattednow = formattedNow()
  return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: "inbox", waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
