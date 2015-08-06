Template.multitasks.helpers({
  multitasks0: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.toString()}]}, {sort: {rank: -1}})
  },
  mitornot: function () {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      return 'active'
    }
    else {
      return ''
    }
  },
  editing: function () {
    return Session.equals('editing_itemname', this._id);
  },
})

// begin modular subscription loading

Template.multitasks.created = function () {

  // 1. Initialization
  var context = this.data
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.multitaskslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var multitaskslimit = instance.multitaskslimit.get();

//    console.log("Asking for "+multitaskslimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingmultitasks', context)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
//      console.log("> Received "+multitaskslimit+" posts. \n\n")
      instance.loaded.set(multitaskslimit)
      var nonanyaorcontext = Taskspending.findOne({context: context, tags: "largercontext", tags: {$nin: ["anyaor", "aor"]}})
      var anyaorcontext = Taskspending.findOne({context: context, tags: "anyaor", tags: {$nin: ["aor"]}})
      if (nonanyaorcontext && Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: context}]}).count() > 0) {
        Taskspending.update({_id: nonanyaorcontext._id}, {$push: {tags: "anyaor"}})
      }
      else if (anyaorcontext && Taskspending.findOne({$and: [{context: context}, {tags: "largercontext"}, {tags: "anyaor"}, {tags: {$nin: ["aor"]}}]}) && Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: context}]}).count() == 0) {
        Taskspending.update({_id: anyaorcontext._id}, {$pull: {tags: "anyaor"}})
//        console.log("> Subscription is not ready yet. \n\n");
      }
    }
  });

  // 3. Cursor

  instance.taskspendingmultitasks = function() {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: context}]}, {sort: {rank: 1}, limit: instance.loaded.get()})
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
  },
  'dblclick .todo-item': function (e, t) {
    Session.set('editing_itemname', this._id);
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("todo-input");
  },
  'focusout #todo-input': function (e, t) {
    Session.set('editing_itemname', null);
    Meteor.flush();
  },
  'keyup #todo-input': function (e,t) {
    if (e.which === 13)
    {
      var taskVal = String(e.target.value || "");
      if (taskVal)
      {
        var formattednow = formattedNow()
        var uuid = this.uuid
        console.log(Tasksbacklog.insert({owner: Meteor.userId(), description: taskVal, entry: formattednow, uuid:uuid}))
        console.log(Taskspending.update({_id:this._id},{$set:{description: taskVal, entry: formattednow}}))
        Session.set('editing_itemname', null);
       }
     }
  },
});

// end modular subscription loading



