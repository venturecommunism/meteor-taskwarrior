Template.contextpicker.helpers({
  count: function () {
    return (Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: {$in: ["kickstart", "mit"]}}, {context: this.context}]}, {sort: {rank: {$exists: true}, rank: 1}}).count() + Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.context}]}, {sort: {rank: -1}}).count() + '/' + Taskspending.find({context: this.context, tags: {$nin: ["largercontext"]}}).count() + ' visible')
//    return Taskspending.find({context: this.context}).count()
  },
  checkedcontext: function () {
    if (Session.get("multicontext")) {
      if (Session.get("multicontext").indexOf(this.context) > -1) {
        return '+';
      }
      else {
        return '-';
      }
    }
  },
  contexts1: function () {
    return context_infos()
  },
})

Template.contextpicker.events({
  'click #contextpicker li .btn': function (e,t) {
    tempcontext = Session.get("multicontext")
    if (!tempcontext) {
      Session.set("multicontext", [this.context])
    }
    else if (tempcontext.length == 0) {
      Session.set("multicontext", [this.context])
    }
    else if (Session.get("multicontext").indexOf(this.context) < 0) {
      tempcontext.push(this.context)
      Session.set("multicontext", tempcontext)
    }
    else {
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("multicontext", tempcontext)
    }
  },
})

// begin modular subscription loading

Template.contextpicker.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.contextpickerlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var contextpickerlimit = instance.contextpickerlimit.get();

    console.log("Asking for "+contextpickerlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingcontextpicker', contextpickerlimit, function () {
      Session.set('taskspending_dataloaded', true)
    })

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+contextpickerlimit+" posts. \n\n")
      instance.loaded.set(contextpickerlimit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingcontextpicker = function() {
    return Taskspending.find({tags: "largercontext"}, {sort: {rank: 1}, limit: instance.loaded.get()})
  }

};

Template.contextpicker.helpers({
  // the posts cursor
  contexts: function () {
    return Template.instance().taskspendingcontextpicker();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingcontextpicker().count() >= Template.instance().contextpickerlimit.get();
  }
});

Template.contextpicker.events({
  'click .load-more-contextpicker': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var contextpickerlimit = instance.contextpickerlimit.get();

    // increase limit by 5 and update it
    contextpickerlimit += 5;
    instance.contextpickerlimit.set(contextpickerlimit)
  }
});

// end modular subscription loading
