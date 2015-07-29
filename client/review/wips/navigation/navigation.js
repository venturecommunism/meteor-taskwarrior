Session.setDefault("navigationhidden", true)

// begin modular subscription loading

Template.navigation.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.navigationlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var navigationlimit = instance.navigationlimit.get();

    // console.log("Asking for "+navigationlimit+" navigation tasks…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingnavigation', navigationlimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+navigationlimit+" navigation tasks. \n\n")
      instance.loaded.set(navigationlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingnavigation = function() {
    return Taskspending.find({context: "navigation", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: instance.loaded.get()})
  }

};

Template.navigation.helpers({
  // the posts cursor
  navigation: function () {
    return Template.instance().taskspendingnavigation();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingnavigation().count() >= Template.instance().navigationlimit.get();
  },
  navigationsectionhidden: function () {
    return Session.equals('navigationhidden', true)
  },
});

Template.navigation.events({
  'click .load-more-navigation': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var navigationlimit = instance.navigationlimit.get();

    // increase limit by 5 and update it
    navigationlimit += 5;
    instance.navigationlimit.set(navigationlimit)
  },
  'click .closenavigationsection': function(e,t){
    Session.set('navigationhidden', true)
  },
  'click .opennavigationsection': function(e,t){
    Session.set('navigationhidden', false)
  },
});

// end modular subscription loading

