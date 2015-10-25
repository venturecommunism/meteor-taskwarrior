Template.mostimportanttasks.helpers({
  mits: function () {
    return Taskspending.find({tags: "mit"}, {sort: {rank: 1}})
  },
  somedaymaybeproject: function () {
    if (this.project && Taskspending.findOne({tags: "somedaymaybeproj", project: this.project})) {
      return true
    }
  },
  somedaymaybecontext: function () {
    if (this.context && Taskspending.findOne({tags: "somedaymaybecont", context: this.context})) {
      return true
    }
  },
  aor: function () {
    if (!Taskspending.findOne({tags: "aorfocus"})) {
      return true
    }
    if (!this.project) {
      return true
    }
    var projectaor = Taskspending.findOne({project: this.project, tags: "largeroutcome"}).aor
    var aorfocus = Taskspending.findOne({_id: projectaor, tags: "aorfocus"})
    if (aorfocus) {
      return true
    }
  },
  sorting_mits: function () {
    if (Session.equals('sorting_mits', true)) {
      return 'btn-primary'
    } else {
      return ''
    }
  },
})

// begin modular subscription loading

Template.mostimportanttasks.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.mitslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var mitslimit = instance.mitslimit.get();

    // console.log("Asking for "+mitslimit+" MITs…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingmits', mitslimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+mitslimit+" MITs. \n\n")
      instance.loaded.set(mitslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingmits = function() {
    return Taskspending.find({tags: "mit", context: {$exists: 1}, project: {$exists: 1}}, {sort: {rank: 1}})
  }

};

Template.mostimportanttasks.helpers({
  // the posts cursor
  mits: function () {
    return Template.instance().taskspendingmits();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingmits().count() >= Template.instance().mitslimit.get();
  }
});

Template.mostimportanttasks.events({
  'click .load-more-mits': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var mitslimit = instance.mitslimit.get();

    // increase limit by 5 and update it
    mitslimit += 5;
    instance.mitslimit.set(mitslimit)
  },
  'click .closemitssection': function(e,t){
    Session.set('mitshidden', true)
  },
});

// end modular subscription loading

