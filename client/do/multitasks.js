Template.multitasks.helpers({
  multitasks0: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.toString()}]}, {sort: {rank: -1}})
  },
})

// begin modular subscription loading

Template.multitasks.created = function () {

  // 1. Initialization
  var context = this.data
console.log("data context is " + context)
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.multitaskslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var multitaskslimit = instance.multitaskslimit.get();

    console.log("Asking for "+multitaskslimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingmultitasks', context)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+multitaskslimit+" posts. \n\n")
      instance.loaded.set(multitaskslimit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingmultitasks = function() {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: context}]}, {sort: {rank: -1}, limit: instance.loaded.get()})
  }

};

Template.multitasks.helpers({
  // the posts cursor
  multitasks: function () {
    return Template.instance().taskspendingmultitasks();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingmultitasks().count() >= Template.instance().multitaskslimit.get();
  }
});

Template.multitasks.events({
  'click .load-more-context': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var multitaskslimit = instance.multitaskslimit.get();

    // increase limit by 5 and update it
    multitaskslimit += 5;
    instance.multitaskslimit.set(multitaskslimit)
  }
});

// end modular subscription loading



