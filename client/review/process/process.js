Session.set('processing_task', false);

Template.process.events({
  'click #btnAddItem': function (e,t){
    Session.set('list_adding',true);
    Meteor.flush();
    focusText(t.find("#item_to_add"));
  },
  'keyup #item_to_add': function (e,t){
    if (e.which === 13)
      {
        addItem(Session.get('current_list'),e.target.value);
        Session.set('list_adding',false);
      }
  },
  'focusout #item_to_add': function(e,t){
//    Session.set('list_adding',false);
  },
  'click .delete_item': function(e,t){
    removeItem(e.target.id);
  },
  'click .project': function(e,t){
    Session.set('project_input',this.Name);
    Meteor.flush();
    focusText(t.find(".title"),this.project);

  },
  'click .startprocessing-button': selectTaskProcessing,
  'click .closeinboxsection': function(e,t){
    Session.set('inboxhidden', true)
  },
});

Template.process.helpers({
  tasks1: function () {
    formattednow = formattedNow()
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: "inbox"})
  },
  inboxcount: function () {
    return Taskspending.find({tags: "inbox"}).count()
  },
  is_processing: function () {
    return Session.get('process_status')
  },
  waiting: function () {
    if (!this.wait) {
      return false
    }
    var formattednow = formattedNow()
    var string = this.wait
    var string = string.split("T")[0] + string.split("T")[1]
    var string = string.split("Z")[0]
    if (string > formattednow) {
    }
    return (string > formattednow)
  },
})

// begin modular subscription loading

Template.process.created = function () {

  // 1. Initialization
  
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.unprocessedlimit = new ReactiveVar(5);
  
  // 2. Autorun
  
  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var unprocessedlimit = instance.unprocessedlimit.get();

    // console.log("Asking for "+unprocessedlimit+" posts…")
    
    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingunprocessed', unprocessedlimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+unprocessedlimit+" posts. \n\n")
      instance.loaded.set(unprocessedlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.taskspendingunprocessed = function() { 
    return Taskspending.find({tags: "inbox"}, {sort: {rank: 1}, limit: instance.loaded.get()});
  }
  
};

Template.process.helpers({
  // the posts cursor
  tasks: function () {
    return Template.instance().taskspendingunprocessed();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingunprocessed().count() >= Template.instance().unprocessedlimit.get();
  }
});

Template.process.events({
  'click .load-more-unprocessed': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many posts are currently displayed
    var unprocessedlimit = instance.unprocessedlimit.get();
    
    // increase limit by 5 and update it
    unprocessedlimit += 5;
    instance.unprocessedlimit.set(unprocessedlimit)
  }
});

// end modular subscription loading
