Template.workinprogress.helpers({
  wips0: function () {
    return Taskspending.find({tags: "mit"}, {sort: {rank: 1}})
  },
  wipproject: function () {
    if (!this.project) {
      return true
    }
    else if (this.project && Taskspending.findOne({wip: "projwip", project: this.project})) {
      return true
    }
  },
  wipcontext: function () {
    if (this.context && Taskspending.findOne({wip: "contwip", context: this.context})) {
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
  sorting_wips: function () {
    if (Session.equals('sorting_wips', true)) {
      return 'btn-primary'
    } else {
      return ''
    }
  },
})

// begin modular subscription loading

Template.workinprogress.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.wipslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var wipslimit = instance.wipslimit.get();

    // console.log("Asking for "+wipslimit+" WIPs…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingwips', wipslimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+wipslimit+" WIPs. \n\n")
      instance.loaded.set(wipslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingwips = function() {
    return Taskspending.find({wip: {$in: ["projwip", "contwip"]}, context: {$exists: 1}, project: {$exists: 1}}, {sort: {rank: 1}})
  }

};

Template.workinprogress.helpers({
  // the posts cursor
  wips: function () {
    return Template.instance().taskspendingwips();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingwips().count() >= Template.instance().wipslimit.get();
  }
});

Template.workinprogress.events({
  'click .load-more-wips': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var wipslimit = instance.wipslimit.get();

    // increase limit by 5 and update it
    wipslimit += 5;
    instance.wipslimit.set(wipslimit)
  },
  'click .closewipssection': function(e,t){
    Session.set('wipshidden', true)
  },
});

// end modular subscription loading

