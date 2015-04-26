Template.categories.events({
  'click #process': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', false);
    Session.set('do_status', false);
    Session.set('process_status', true)
  },
  'click #organize': function (e, t) {
    Session.set('organize_status', true);
    Session.set('review_status', false);
    Session.set('do_status', false);
    Session.set('process_status', false)
  },
  'click #do': function (e, t) {
    Session.set('organize_status', false);
    Session.set('review_status', false);
    Session.set('do_status', true);
    Session.set('process_status', false)
  },
});

Template.categories.helpers({
  inboxstuff: function () {
    return Taskspending.findOne({tags: "inbox"})
  },
  process_status: function () {
    return Session.equals('process_status',true) ? 'active' : ''
  },
  organize_status: function () {
    return Session.equals('organize_status',true) ? 'active' : ''
  },
  do_status: function () {
    return Session.equals('do_status',true) ? 'active' : ''  
  },
})
