Template.inactivecontextpicker.helpers({
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
  contexts: function () {
    return Taskspending.find({tags: "somedaymaybecont"}, {sort: {rank: 1}})
  },
})

Template.inactivecontextpicker.events({
  'click #inactivecontextpicker li .btn': function (e,t) {
    tempcontext = Session.get("multicontext")
    if (!tempcontext) {
      Session.set("multicontext", [this.context])
      Taskspending.update({_id: this._id}, {$pull: {tags: "somedaymaybecont"}})
    }
    else if (tempcontext.length == 0) {
      Session.set("multicontext", [this.context])
      Taskspending.update({_id: this._id}, {$pull: {tags: "somedaymaybecont"}})
    }
    else if (Session.get("multicontext").indexOf(this.context) < 0) {
      tempcontext.unshift(this.context)
      Session.set("multicontext", tempcontext)
      Taskspending.update({_id: this._id}, {$pull: {tags: "somedaymaybecont"}})
    }
    else {
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("multicontext", tempcontext)
    }
  },
})

// begin modular subscription loading

Template.inactivecontextpicker.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.inactivecontextpickerlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var inactivecontextpickerlimit = instance.inactivecontextpickerlimit.get();

    // console.log("Asking for "+inactivecontextpickerlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendinginactivecontextpicker', inactivecontextpickerlimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+inactivecontextpickerlimit+" posts. \n\n")
      instance.loaded.set(inactivecontextpickerlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendinginactivecontextpicker = function() {
    return Taskspending.find({tags: "somedaymaybecont"}, {sort: {rank: 1}})
  }

};

Template.inactivecontextpicker.helpers({
  // the posts cursor
  contexts1: function () {
    return Template.instance().taskspendinginactivecontextpicker();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendinginactivecontextpicker().count() >= Template.instance().inactivecontextpickerlimit.get();
  }
});

Template.inactivecontextpicker.events({
  'click .load-more-inactivecontextpicker': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var inactivecontextpickerlimit = instance.inactivecontextpickerlimit.get();

    // increase limit by 5 and update it
    inactivecontextpickerlimit += 5;
    instance.inactivecontextpickerlimit.set(inactivecontextpickerlimit)
  }
});

// end modular subscription loading

