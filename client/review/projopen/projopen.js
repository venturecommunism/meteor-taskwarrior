Template.openproject.helpers({
  projopen: function () {
    return Session.equals('projopen', this.project)
  },
  orgtasks: function () {
      return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: this.project, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {tags: "kickstart", tags: "checklistitem", tags: "milestone", rank: 1}})
  },
  kickstartertask: function () {
    if (Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project})) {
      return Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project}, {$sort: {rank: 1}, limit: 1})
    }
  },
})

Template.openproject.events({
  'click .reviewproject': function (e,t) {
    if (Session.equals('projopen', this.project)) {
    if (!$('.active-project.nokickstarttask')) {
      Session.set('projopen',false)
    } else {
      var nokickstartproj = Taskspending.findOne({_id: $('.active-project.nokickstarttask .task_item button').last().attr('id')})
      if (nokickstartproj) {
        Session.set('projopen', nokickstartproj.project)
      } else {
        Session.set('projopen', false)
      }
    }
    $('.active-project.nokickstarttask').detach().prependTo('ul#project_list')
    $('.active-project.kickstarttask').detach().appendTo('ul#project_list')
    } else {
      Session.set('projopen', this.project);
    }
  },
})


// begin modular subscription loading

Template.openproject.created = function () {

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

    console.log("Asking for "+calendarlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingcalendar', calendarlimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+calendarlimit+" posts. \n\n")
      instance.loaded.set(calendarlimit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingcalendar = function() {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: instance.loaded.get()})
  }

};

Template.openproject.helpers({
  // the posts cursor
  calendartasks: function () {
    return Template.instance().taskspendingcalendar();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingcalendar().count() >= Template.instance().calendarlimit.get();
  }
});

Template.openproject.events({
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

