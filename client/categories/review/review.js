Template.categories.helpers({
  review_status: function () {
    return Session.equals('review_status',true) ? 'active' : ''
  }
})

Template.categories.events({
  'click #review': function (e, t) {
    Session.set('review_status', true)
  }
})

Deps.autorun(function(){
  if (Session.equals('review_status', true)) {
    if (Taskspending.findOne({tags: "inbox"})) {
      Session.set('organize_status', false);
      Session.set('review_status', true);
      Session.set('do_status', false);
      Session.set('process_status', true)
      return;
    }
    else {
      Session.set('organize_status', false)
      Session.set('do_status', false)
      Session.set('process_status', false)
    }
  }
})
