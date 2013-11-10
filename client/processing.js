Session.set('processing_task', false);

Template.processingdialog.tasks = function () {
  return Taskspending.findOne({_id: Session.get('current_processedtask')})
}

Template.processingdialog.has_project = function () {
  return (Taskspending.findOne({_id: Session.get('current_processedtask')}).project ? 1 : 0 )
}

function selectTaskProcessing(e,t){
  Session.set('current_processedtask',this._id);
  Session.set('processing_task',true);
  Meteor.flush()
  focusText(t.find(".modal .title"));
};

function removeItem(list_id,item_name){
  if (!item_name&&!list_id)
    return;
  Taskspending.remove({_id:list_id});
};

function updateProject(list_id,item_name,project_name){
  var l = lists.findOne({"_id":list_id,"items.Name":item_name});
  if (l&&l.items){
    for (var i = 0; i<l.items.length; i++){
      if (l.items[i].Name === item_name){
          l.items[i].LentTo = project_name;
      }
    }
    lists.update({"_id":list_id},{$set:{"items":l.items}}); 	
  }
};

Template.processingdialog.events({
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
      trashtask.tags.delete
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
    if (archivetask.tags.length == 0) {
      archivetask.tags.delete
    }
    archivetask.tags.push("archive")
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
    if (somedaymaybetask.tags.length == 0) {
      somedaymaybetask.tags.delete
    }
    somedaymaybetask.tags.push("somedaymaybe")
    Tasksbacklog.insert(somedaymaybetask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing

  },

});

//////////Generic Helper Functions///////////
//this function puts our cursor where it needs to be.
function focusText(i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();
};


Template.processingdialog.processing_task = function () {
  return (Session.equals('processing_task',true));
};

Template.list.events({
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


