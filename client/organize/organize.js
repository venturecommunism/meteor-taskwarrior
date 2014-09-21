Session.set('processing_task', false);

Template.organize.events({
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
    Session.set('project_title',this.Name);
    Meteor.flush();
//    focusText(t.find(".title"),this.project);

  },
  'keyup .title': function (e,t){
    if (e.which === 13)
      { 
        projecttask = Taskspending.findOne({_id: Session.get('current_processedtask')})
        projecttask.project = e.target.value
console.log(projecttask._id)
        delete projecttask._id
console.log(projecttask._id + ' yo this thing')
// removing Tasksbacklog.insert for now but should put it back in keeping in mind Taskwarrior specs
//        Tasksbacklog.insert(projecttask)
        var largeroutcome_old = Taskspending.findOne({project: this.project, tags: "largeroutcome"})
        var largeroutcome_testexisting = Taskspending.findOne({project: e.target.value, tags: "largeroutcome"})
        if (Taskspending.find({project: this.project, tags: {$ne: "largeroutcome"}}).count == 1 && largeroutcome_old && !largeroutcome_testexisting) {
          Taskspending.insert({description: largeroutcome_old.description, project: e.target.value, tags: "largeroutcome"})
          Taskspending.remove({_id: largeroutcome_old._id})
        }
if (e.target.value == '') {
        Taskspending.update({_id: this._id},{$unset:{project:e.target.value}})
}
else {
        Taskspending.update({_id: this._id},{$set:{project:e.target.value}})
}

      }
  },
  'click .kickstart.choosekickstart': function (e,t) {
    Taskspending.update({_id: this._id}, {$set:{tags:["mit"]}});
    Meteor.flush()
    Session.set('review_status', true)
  },
  'click .kickstart.btn-danger': function (e,t) {
    Taskspending.update({_id: this._id}, {$unset:{tags:"mit"}})
    Meteor.flush()
  },
  'click .startprocessing-button': selectTaskProcessing,
  'click .dep-button': selectDepProcessing
});

Template.organize.is_organizing = function () {
  return Session.get('organize_status')
}

Template.organize.tasks = function () {
  var formattednow = formattedNow()
  var project_filter = Session.get('project_filter');
  if (project_filter) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$ne: "inbox"}}, {tags: "mit"}]})
  }
}

Template.organize.tasks2 = function () {
  var formattednow = formattedNow()
  var project_filter = Session.get('project_filter');
  if (project_filter) {
return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$ne: "inbox"}}, {tags: {$ne: "mit"}}, {type: {$nin: ["textfile", "checklist"]}}]})
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$not: "inbox"}}, {tags: {$not: "mit"}}, {type: {$ne: "textfile"}}], waiting: { $lt: formattednow}})
// Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, tags: {$ne: "inbox"}, tags: "mit", waiting: { $lt: formattednow}}, {sort: {due: -1}}),
// Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, tags: {$ne: ["inbox", "mit"]}, waiting: { $lt: formattednow}}, {sort: {due: -1}}),
}
  else if (project_filter === undefined) {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: { $exists: false}, tags: {$ne: "inbox"}})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: {$ne: "inbox"}})
  }
}
