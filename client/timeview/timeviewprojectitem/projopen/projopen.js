Template.openproject.helpers({
  projectid: function () {
    return Taskspending.findOne({type: "largeroutcome", project: this.project})._id 
  },
  projopen: function () {
    return Session.equals('projopen', this.project)
  },
  orgtasks1: function () {
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
  var project = this.data.project
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.openprojectlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var openprojectlimit = instance.openprojectlimit.get();

    // console.log("Asking for "+openprojectlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingopenproject', project)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+openprojectlimit+" posts. \n\n")
      instance.loaded.set(openprojectlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingopenproject = function() {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: Session.get("projopen"), tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {tags: "kickstart", tags: "checklistitem", tags: "milestone", rank: 1}, limit: instance.loaded.get()})
  }

};

Template.openproject.helpers({
  // the posts cursor
  openprojecttasks: function () {
    return Template.instance().taskspendingopenproject();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingopenproject().count() >= Template.instance().openprojectlimit.get();
  }
});

Template.openproject.events({
  'click .load-more-project': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var openprojectlimit = instance.openprojectlimit.get();

    // increase limit by 5 and update it
    openprojectlimit += 5;
    instance.openprojectlimit.set(openprojectlimit)
  }
});

// end modular subscription loading

