// begin modular subscription loading

Template.waitingfors.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.waitingforslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var waitingforslimit = instance.waitingforslimit.get();

    // console.log("Asking for "+waitingforslimit+" waiting fors…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingwaitingfors', waitingforslimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+waitingforslimit+" waiting fors. \n\n")
      instance.loaded.set(waitingforslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingwaitingfors = function() {


    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      return Taskspending.find({context: "waitingfor", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: instance.loaded.get()})
    }
    else {
      var aorprojects = new Array()
      Taskspending.find({_id: {$in: aorfocus}}).forEach(function (doc) {
        aorprojects.push(doc.project)
        Taskspending.find({tags: "largeroutcome", aor: doc._id}).forEach(function (doc) {
          aorprojects.push(doc.project)
        })
      })
      return Taskspending.find({project: {$in: aorprojects}, context: "waitingfor", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: instance.loaded.get()})
    }
  }
};

Template.waitingfors.helpers({
  // the posts cursor
  waitingfors: function () {
    return Template.instance().taskspendingwaitingfors();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingwaitingfors().count() >= Template.instance().waitingforslimit.get();
  }
});

Template.waitingfors.events({
  'click .load-more-waitingfors': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var waitingforslimit = instance.waitingforslimit.get();

    // increase limit by 5 and update it
    waitingforslimit += 5;
    instance.waitingforslimit.set(waitingforslimit)
  },
  'click .closewaitingforssection': function(e,t){
    Session.set('waitingforshidden', true)
  },
});

// end modular subscription loading

