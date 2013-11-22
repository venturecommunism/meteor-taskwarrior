Session.set('processing_task', false);

Session.setDefault('project_filter', null);

//////////Generic Helper Functions///////////
//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();
};


function selectTaskProcessing(e,t){
  Session.set('current_processedtask',this._id);
  Session.set('processing_task',true);
  Meteor.flush()
console.log(t.find(".modal .title"))
  focusText(t.find(".modal .title"));
};

// Pick out the unique projects from all tasks in pending tasks
Template.project_filter.projects = function () {
  var project_infos = [];
  var total_count = 0;

//the cursor below doesn't have the formattednow waiting field
  Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: {$not: "inbox"}}, {sort: {due: -1}}).forEach(function (task) {
//the bottom may be for arrays of tags rather than the single project that is allowed
//    _.each(task.project, function (project) {
      var project_info = _.find(project_infos, function (x) { return x.project === task.project; });
      if (! project_info)
        project_infos.push({project: task.project, count: 1});
      else
        project_info.count++;
//    });
    total_count++;
  });

  project_infos = _.sortBy(project_infos, function (x) { return x.project; });
  project_infos.unshift({project: null, count: total_count});

  return project_infos;
};

Template.project_filter.project_text = function () {
   return this.project || "All items";
};

Template.project_filter.events({
  'mousedown .project': function () {
    if (Session.equals('project_filter', this.project))
      Session.set('project_filter', null);
    else
      Session.set('project_filter', this.project);
  }
});

Template.project_filter.selected = function () {
  return Session.equals('project_filter', this.project) ? 'active btn-danger' : '';
};

Template.processingdialog.tasks = function () {
  return Taskspending.findOne({_id: Session.get('current_processedtask')})
}


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


Template.organize.events({
  'focusout .processingdialog': function(e,t) {
//     Session.set('processing_task',false);
  },
  'click .trash': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: {$not: "inbox"}})._id)
    selectTaskProcessing
  },
  'click .archive': function() {
    archivetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    archivetask.status = 'completed'
    archivetask.tags.push("archive")
    delete archivetask._id
    Tasksbacklog.insert(archivetask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: {$not: "inbox"}})._id)
    selectTaskProcessing
  },
  'click .somedaymaybe': function() {
    somedaymaybetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    id = somedaymaybetask._id
    delete somedaymaybetask._id
    somedaymaybetask.tags.push("somedaymaybe")
    Tasksbacklog.insert(somedaymaybetask)
    Taskspending.update({_id: id},{$set: somedaymaybetask})
    Session.set('current_processedtask',Taskspending.findOne({tags: {$not: "inbox"}})._id)
    selectTaskProcessing
  },
  'click .do': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: {$not: "inbox"}})._id)
    selectTaskProcessing
  },
  'click .defer': function() {
    defertask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    id = defertask._id
    delete defertask._id
    console.log(defertask)
    Tasksbacklog.insert(defertask)
    Taskspending.update({_id: id},{$set: defertask})
//not sure if should keep the $unset for tags
    Taskspending.update({_id: id},{$unset: {tags: ""}})
    Session.set('current_processedtask',Taskspending.findOne({tags: {$not: "inbox"}})._id)
    selectTaskProcessing
  },


});

