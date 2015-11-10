Template.calendar.events({
  'click .closecalendarsection': function(e,t){
    Session.set('calendarhidden', true)
  },
})

// begin modular subscription loading

Template.calendar.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.calendarlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var calendarlimit = instance.calendarlimit.get();

    // console.log("Asking for "+calendarlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingcalendar', calendarlimit, function () {
      Session.set('taskspending_dataloaded', true)
    })

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+calendarlimit+" posts. \n\n")
      instance.loaded.set(calendarlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingcalendar = function() {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: instance.loaded.get()})
  }

};

Template.calendar.helpers({
  // the posts cursor
  calendartasks: function () {
    return Template.instance().taskspendingcalendar();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingcalendar().count() >= Template.instance().calendarlimit.get();
  }
});

Template.calendar.events({
  'click .load-more-calendar': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var calendarlimit = instance.calendarlimit.get();

    // increase limit by 5 and update it
    calendarlimit += 5;
    instance.calendarlimit.set(calendarlimit)
  }
});

// end modular subscription loading


