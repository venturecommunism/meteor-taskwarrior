Template.processingdialog.events({
  'click .modal .cancel': function(e,t) {
     Session.set('processing_task',false);
   }
});

Template.processingdialog.tasks = function () {
  return Taskspending.findOne({_id: Session.get('current_processedtask')})
}

Template.processingdialog.processing_task = function () {
  return (Session.equals('processing_task',true));
};

