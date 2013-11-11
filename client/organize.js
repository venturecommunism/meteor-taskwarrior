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
    var i = trashtask.tags.indexOf("inbox");
    if(i != -1) {
      trashtask.tags.splice(i, 1);
    }
    if (trashtask.tags.length == 0) {
      delete trashtask.tags
    }
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .archive': function() {
    archivetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    archivetask.status = 'completed'
    var i = archivetask.tags.indexOf("inbox");
    if(i != -1) {
      archivetask.tags.splice(i, 1);
    }
    archivetask.tags.push("archive")
    delete archivetask._id
    Tasksbacklog.insert(archivetask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .somedaymaybe': function() {
    somedaymaybetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = somedaymaybetask.tags.indexOf("inbox");
    if(i != -1) {
      somedaymaybetask.tags.splice(i, 1);
    }
    id = somedaymaybetask._id
    delete somedaymaybetask._id
    somedaymaybetask.tags.push("somedaymaybe")
    Tasksbacklog.insert(somedaymaybetask)
    Taskspending.update({_id: id},{$set: somedaymaybetask})
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .do': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
    var i = trashtask.tags.indexOf("inbox");
    if(i != -1) {
      trashtask.tags.splice(i, 1);
    }
    if (trashtask.tags.length == 0) {
      delete trashtask.tags
    }
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
  'click .defer': function() {
    defertask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = defertask.tags.indexOf("inbox");
    if(i != -1) {
      defertask.tags.splice(i, 1);
      console.log(defertask.tags)
    }
    if (defertask.tags.length == 0) {
      delete defertask.tags
      console.log(defertask)
    }
    console.log(defertask._id + 'is the _id')
    id = defertask._id
    delete defertask._id
    console.log(defertask)
    Tasksbacklog.insert(defertask)
    Taskspending.update({_id: id},{$set: defertask})
    Taskspending.update({_id: id},{$unset: {tags: ""}})
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },


});

