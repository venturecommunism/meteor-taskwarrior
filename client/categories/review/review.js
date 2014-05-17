Template.categories.events({
  'click #review': function (e, t) {

    if (!Taskspending.findOne({tags:"inbox"})) {  
      Session.set('organize_status', false);
      Session.set('review_status', true);
      Session.set('do_status', false);
      Session.set('process_status', false)
    } else {
      Toast.success('Step 1: Process your inbox', 'Daily Review', {displayDuration: 5000});
      Session.set('organize_status', false);
      Session.set('review_status', false);
      Session.set('do_status', false);
      Session.set('process_status', true)
    }
  },
});
