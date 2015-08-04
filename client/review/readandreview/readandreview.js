// begin modular subscription loading

Template.readandreview.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.readandreviewlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var readandreviewlimit = instance.readandreviewlimit.get();

    // console.log("Asking for "+readandreviewlimit+" items to read and review…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingreadandreview', readandreviewlimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+readandreviewlimit+" items to read and review. \n\n")
      instance.loaded.set(readandreviewlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingreadandreview = function() {

    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      return Taskspending.find({context: "readandreview", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: instance.loaded.get()})
    }
    else {
      var aorprojects = new Array()
      Taskspending.find({_id: {$in: aorfocus}}).forEach(function (doc) {
        aorprojects.push(doc.project)
        Taskspending.find({tags: "largeroutcome", aor: doc._id}).forEach(function (doc) {
          aorprojects.push(doc.project)
        })
      })
      return Taskspending.find({project: {$in: aorprojects}, context: "readandreview", tags: {$ne: "largercontext"}}, {sort: {rank: 1}, limit: instance.loaded.get()})
    }
  }
};

Template.readandreview.helpers({
  // the posts cursor
  readandreview: function () {
    return Template.instance().taskspendingreadandreview();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingreadandreview().count() >= Template.instance().readandreviewlimit.get();
  }
});

Template.readandreview.events({
  'click .load-more-readandreview': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var readandreviewlimit = instance.readandreviewlimit.get();

    // increase limit by 5 and update it
    readandreviewlimit += 5;
    instance.readandreviewlimit.set(readandreviewlimit)
  },
  'click .closereadandreviewsection': function(e,t){
    Session.set('readandreviewhidden', true)
  },
});

// end modular subscription loading

