Template.projectlesssomedaymaybes.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.projectlesssomedaymaybeslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var projectlesssomedaymaybeslimit = instance.projectlesssomedaymaybeslimit.get();

    console.log("Asking for "+projectlesssomedaymaybeslimit+" projectless somedaymaybes…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingprojectlesssomedaymaybes', projectlesssomedaymaybeslimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+projectlesssomedaymaybeslimit+" projectless somedaymaybes. \n\n")
      instance.loaded.set(projectlesssomedaymaybeslimit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingprojectlesssomedaymaybes = function() {
    return Taskspending.find({context: "somedaymaybe"}, {limit: instance.loaded.get()})

//    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due: 1}, limit: instance.loaded.get()})
  }

};

Template.projectlesssomedaymaybes.helpers({
  // the posts cursor
  projectlesssomedaymaybes: function () {
    return Template.instance().taskspendingprojectlesssomedaymaybes();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingprojectlesssomedaymaybes().count() >= Template.instance().projectlesssomedaymaybeslimit.get();
  }
});

Template.somedaymaybeprojects.events({
  'click .load-more-somedaymaybeprojects': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var somedaymaybeprojectslimit = instance.somedaymaybeprojectslimit.get();

    // increase limit by 5 and update it
    somedaymaybeprojectslimit += 5;
    instance.somedaymaybeprojectslimit.set(somedaymaybeprojectslimit)
  }
});

// end modular subscription loading

