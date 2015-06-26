Template.somedaymaybeprojects.helpers({
  somedaymaybeprojects: function () {
    return Taskspending.find({tags: "somedaymaybeproj"}, {sort: {rank: 1}})
  },
})

Template.somedaymaybeprojects.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.somedaymaybeprojectslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var somedaymaybeprojectslimit = instance.somedaymaybeprojectslimit.get();

    // console.log("Asking for "+somedaymaybeprojectslimit+" somedaymaybe projects…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingsomedaymaybeprojects', somedaymaybeprojectslimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+somedaymaybeprojectslimit+" somedaymaybe projects. \n\n")
      instance.loaded.set(somedaymaybeprojectslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingsomedaymaybeprojects = function() {
    return Taskspending.find({tags: "somedaymaybeproj"}, {sort: {rank: 1}})
  }

};

Template.somedaymaybeprojects.helpers({
  // the posts cursor
  somedaymaybeprojects1: function () {
    return Template.instance().taskspendingsomedaymaybeprojects();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingsomedaymaybeprojects().count() >= Template.instance().somedaymaybeprojectslimit.get();
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

