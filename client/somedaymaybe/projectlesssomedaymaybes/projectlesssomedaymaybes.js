Template.projectlesssomedaymaybes.helpers({
  somedaymaybetasks1: function () {
    return Taskspending.find({context: "somedaymaybe"})
  },
})

// begin modular subscription loading

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

    // console.log("Asking for "+projectlesssomedaymaybeslimit+" projectless somedaymaybes…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingprojectlesssomedaymaybes', projectlesssomedaymaybeslimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+projectlesssomedaymaybeslimit+" projectless somedaymaybes. \n\n")
      instance.loaded.set(projectlesssomedaymaybeslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingprojectlesssomedaymaybes = function() {

    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      return Taskspending.find({context: "somedaymaybe", tags: {$ne: "largercontext"}}, {limit: instance.loaded.get()}, {sort: {rank: 1}})
    }
    else {
      var aorprojects = new Array()
      Taskspending.find({_id: {$in: aorfocus}}).forEach(function (doc) {
        aorprojects.push(doc.project)
        Taskspending.find({tags: "largeroutcome", aor: doc._id}).forEach(function (doc) {
          aorprojects.push(doc.project)
        })
      })
      return Taskspending.find({project: {$in: aorprojects}, context: "somedaymaybe", tags: {$ne: "largercontext"}}, {limit: instance.loaded.get()}, {sort: {rank: 1}})

    }
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

Template.projectlesssomedaymaybes.events({
  'click .load-more-projectlesssomedaymaybes': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var projectlesssomedaymaybeslimit = instance.projectlesssomedaymaybeslimit.get();

    // increase limit by 5 and update it
    projectlesssomedaymaybeslimit += 5;
    instance.projectlesssomedaymaybeslimit.set(projectlesssomedaymaybeslimit)
  },
  'click .closeprojectlesssomedaymaybessection': function(e,t){
    Session.set('projectlesssomedaymaybeshidden', true)
  },
});

// end modular subscription loading

