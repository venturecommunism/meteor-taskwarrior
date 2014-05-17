Session.set('processing_task', false);

now = moment()
var formattednow = now.format('YYYYMMDD') + 'T' + now.format('HHmmss') + 'Z'
console.log('formatted is ' + formattednow)


function selectTaskProcessing(e,t){
  Session.set('current_processedtask',this._id);
  Session.set('processing_task',true);
  Meteor.flush()
console.log(t.find(".modal .title"))
  focusText(t.find(".modal .title"));
};

function selectDepProcessing(e,t){
  Session.set('current_deppingtask',this._id);
  Session.set('depping_task',true);
  Meteor.flush()
  focusText(t.find(".modal .title"));
};

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
  'click .kickstart.choosekickstart': function (e,t) {
    Taskspending.update({_id: this._id}, {$set:{tags:"mit"}});
    Meteor.flush()
  },
  'click .kickstart.btn-danger': function (e,t) {
    Taskspending.update({_id: this._id}, {$unset:{tags:"mit"}})
    Meteor.flush()
  },
  'click .startprocessing-button': selectTaskProcessing,
  'click .dep-button': selectDepProcessing
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

Template.organize.is_organizing = function () {
  return Session.get('organize_status')
}

Template.organize.tasks = function () {
  var project_filter = Session.get('project_filter');
  if (project_filter)
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}], waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
Template.organize.tasks2 = function () {
  var project_filter = Session.get('project_filter');
  if (project_filter)
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, $and: [{tags: {$not: "inbox"}}, {tags: {$not: "mit"}}], waiting: { $lt: formattednow}}, {sort: {due: -1}})
// Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, tags: {$ne: "inbox"}, tags: "mit", waiting: { $lt: formattednow}}, {sort: {due: -1}}),
// Taskspending.find({status: {$in: ["waiting", "pending"]}, project: project_filter, tags: {$ne: ["inbox", "mit"]}, waiting: { $lt: formattednow}}, {sort: {due: -1}}),
  else
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: {$not: "inbox"}, waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
