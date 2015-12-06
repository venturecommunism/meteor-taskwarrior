Template.processingdialog.events({
  'click .largeroutcome': function (e,t) {
    largeroutcome = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = largeroutcome.tags.indexOf("inbox")
    if(i != -1) {
      largeroutcome.tags.splice(i, 1);
    }
    var i = largeroutcome.tags.indexOf("aorinbox")
    if(i != -1) {
      largeroutcome.tags.splice(i, 1);
    }
    id = largeroutcome._id
    delete largeroutcome._id
    Tasksbacklog.insert(largeroutcome)
    Taskspending.update({_id: id},{$set: largeroutcome})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: id},{$unset: {status: ""}})
    Taskspending.update({_id: id},{$push: {tags: {$each: ["largeroutcome", "kickstarterless"]}}})
    if (Taskspending.findOne({tags:"inbox"})) {
      Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
      selectTaskProcessing
    }
    else {
      Session.set('processing_task', false);
      Session.set('process_status', false)
      Session.set('review_status', true)
    }
  },
  'click .largercontext': function (e,t) {
    largercontext = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = largercontext.tags.indexOf("inbox")
    if(i != -1) {
      largercontext.tags.splice(i, 1)
    }
    var i = largercontext.tags.indexOf("aorinbox")
    if(i != -1) {
      largercontext.tags.splice(i, 1)
    }
    id = largercontext._id
    delete largercontext._id
    Tasksbacklog.insert(largercontext)
    Taskspending.update({_id: id},{$set: largercontext})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: id},{$unset: {status: ""}})
    Taskspending.update({_id: id},{$push: {tags: "largercontext"}})
    if (Taskspending.findOne({tags:"inbox"})) {
      Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
      selectTaskProcessing
    }
    else {
      Session.set('processing_task', false);
      Session.set('process_status', false)
      Session.set('review_status', true)
    }
  },
  'click .archive': function (e,t) {
    archivetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = archivetask.tags.indexOf("inbox")
    if(i != -1) {
      archivetask.tags.splice(i, 1)
    }
    var i = archivetask.tags.indexOf("aorinbox") 
    if(i != -1) {
      archivetask.tags.splice(i, 1) 
    }
    id = archivetask._id
    delete archivetask._id
    Tasksbacklog.insert(archivetask)
    Taskspending.update({_id: id},{$set: archivetask})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: id},{$set: {context: "movetoarchive"}})
    if (Taskspending.findOne({tags:"inbox"})) {
      Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
      selectTaskProcessing
    }
    else {
      Session.set('processing_task', false);
      Session.set('process_status', false)
      Session.set('review_status', true)
    }
  },
  'click .somedaymaybe': function (e,t) {
    somedaymaybetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    var i = somedaymaybetask.tags.indexOf("inbox")
    if(i != -1) {
      somedaymaybetask.tags.splice(i, 1)
    }
    var i = somedaymaybetask.tags.indexOf("aorinbox") 
    if(i != -1) {
      somedaymaybetask.tags.splice(i, 1) 
    }
    somedaymaybetask.tags.push("somedaymaybe")
    id = somedaymaybetask._id
    delete somedaymaybetask._id
    Tasksbacklog.insert(somedaymaybetask)
    Taskspending.update({_id: id},{$set: somedaymaybetask})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    Taskspending.update({_id: id},{$set: {context: "somedaymaybe"}})
    if (Taskspending.findOne({tags:"inbox"})) {
      Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
      selectTaskProcessing
    }
    else {
      Session.set('processing_task', false);
      Session.set('process_status', false)
      Session.set('review_status', true)
    }
  },
  'click .modal .cancel': function(e,t) {
     Session.set('processing_task',false);
   },
  'keyup .title': function (e,t){
    if (e.which === 13)
      {
        projecttask = Taskspending.findOne({_id: Session.get('current_processedtask')})
        projecttask.project = e.target.value
// TODO: have to fix all these backlog inserts
//        Tasksbacklog.insert(projecttask)
        if (e.target.value == '') {
          Taskspending.update({_id: this._id},{$unset:{project:""}})
        }
        else {

console.log("this is what is happening")
          Taskspending.update({_id: this._id},{$set:{project:e.target.value}})
        }
      }
      return false;
    },
  'submit form': function (e,t){
    e.preventDefault()
    e.stopPropagation();
    return false;
  },
  'keyup input.context': function(e,t) {
    if (e.which === 13) {
      if (e.target.value == '') {
        Taskspending.update({_id: this._id},{$unset:{context:""}})
      }
      else {
        Taskspending.update({_id: this._id},{$set:{context:e.target.value}})
      }
    }
  },
  'keyup input#duedate': function(e,t) {
    if (e.which === 13) {
      if (e.target.value == '') {
        Taskspending.update({_id: this._id},{$unset:{due: ""}})
      }
      else {
        Taskspending.update({_id: this._id},{$set:{due:e.target.value}})
      }      
    }
  },
  'click .mit': function(e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      Taskspending.update({_id: this._id},{$pull:{tags:"mit"}})
    } else {
      Taskspending.update({_id: this._id},{$push: {tags: "mit"}})
    }
  },
});


Template.processingdialog.helpers({
  tasks: function () {
    return Taskspending.findOne({_id: Session.get('current_processedtask')})
  },
  processing_task: function () {
    return (Session.equals('processing_task',true))
  },
  has_context: function () {
    return this.context
  },
  has_duedate: function () {
    return this.due
  },
  has_project: function () {
    return (Taskspending.findOne({_id: Session.get('current_processedtask')}).project ? 1 : 0 )
  },
  taskcounter: function () {
    return project_infos()[0].count
  },
  projwithnolargeroutcome: function () {
    return (this.project && !(Taskspending.findOne({project: this.project, tags: "largeroutcome"})))
  },
  contextwithnolargercontext: function () {
    return (this.context && !(Taskspending.findOne({context: this.context, tags: "largercontext"})))
  },
  mitornot: function () {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      return 'active'
    }
    else {
      return ''
    }
  },
})

Template.processingdialog.events({
  'focusout .processingdialog': function(e,t) {
// Session.set('processing_task',false);
  },
  'click .trash': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
if (!Session.get('organize_status') && !Session.get('do_status') && !Session.get('review_status')){
    var i = trashtask.tags.indexOf("inbox")
    if(i != -1) {
      trashtask.tags.splice(i, 1)
    }
    var i = trashtask.tags.indexOf("aorinbox") 
    if(i != -1) {
      trashtask.tags.splice(i, 1) 
    }
    if (trashtask.tags.length == 0) {
      delete trashtask.tags
    }
}
    id = trashtask._id
    delete trashtask._id
    Tasksbacklog.insert(trashtask)
    Taskspending.remove(Session.get('current_processedtask'))
if (!Session.get('organize_status') && !Session.get('do_status') && !Session.get('review_status')){
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
} else {
    Session.set('current_processedtask',false)
}
    selectTaskProcessing
  },
/*
// this was a way to archive tasks by moving them into the Tasksbacklog. Should be revived at some point
  'click .archive': function() {
    archivetask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    archivetask.status = 'completed'
if (!Session.get('organize_status') && !Session.get('do_status')){
    var i = archivetask.tags.indexOf("inbox")
    if(i != -1) {
      archivetask.tags.splice(i, 1)
    }
    var i = archivetask.tags.indexOf("aorinbox") 
    if(i != -1) {
      archivetask.tags.splice(i, 1) 
    }
}
if (archivetask.tags) {
console.log(archivetask.tags)
    archivetask.tags.push("archive")
}
else {
archivetask.tags = ["archive"]
}
    delete archivetask._id
    Tasksbacklog.insert(archivetask)
    Taskspending.remove(Session.get('current_processedtask'))
    Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
    selectTaskProcessing
  },
*/
  'click .do': function() {
    trashtask = Taskspending.findOne({_id: Session.get('current_processedtask')})
    trashtask.status = 'completed'
    var i = trashtask.tags.indexOf("inbox")
    if(i != -1) {
      trashtask.tags.splice(i, 1)
    }
    var i = trashtask.tags.indexOf("aorinbox") 
    if(i != -1) {
      trashtask.tags.splice(i, 1) 
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
console.log("hit defertask")
    if (!defertask.context && !defertask.due) {
      alert("Missing context")
      return
    }
    var i = defertask.tags.indexOf("inbox");
    if(i != -1) {
      defertask.tags.splice(i, 1);
    }
    var i = defertask.tags.indexOf("aorinbox")
    if(i != -1) {
      defertask.tags.splice(i, 1)
    }
    if (defertask.tags.length == 0) {
      delete defertask.tags
    }
    id = defertask._id
    delete defertask._id
    Tasksbacklog.insert(defertask)
    Taskspending.update({_id: id},{$set: defertask})
    Taskspending.update({_id: id},{$pull: {tags: "inbox"}})
    Taskspending.update({_id: id},{$pull: {tags: "aorinbox"}})
    if (Taskspending.findOne({tags:"inbox"}) && Session.equals('process_status',true)) {
//the following two lines are/were an attempt to clear the project and context when automatically selecting a new task to process
//      $('input.context-picker')[3].value = ''
//      $('input.project-picker')[3].value = ''
      Session.set('current_processedtask',Taskspending.findOne({tags: "inbox"})._id)
      selectTaskProcessing
    }
    else if (Session.equals('process_status',false)) {
      Session.set('processing_task', false)
    }
    else {
      Session.set('processing_task', false);
      Session.set('process_status', false)
      Session.set('review_status', true)
    }
  },

})

Template.processingdialog.rendered = function () {

var projectnames = Taskspending.find();
var count = 0;
projects = []
projectnames.forEach(function (task) {
  if (task.project && (projects.indexOf(task.project) == -1)) {
    projects.push(task.project)
  }
  count += 1;
})

  $('#typeahead').typeahead({
    name: 'accounts',
    local: ["process", "organize", "project1", "project2", "project3", "project4"]
  })
}
