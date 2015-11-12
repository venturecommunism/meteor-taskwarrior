Template.focusprojectslist.helpers({
  tasks: function () {
//    Session.set('helpsesh',true)
//    Session.set('helpsesh',false)
    //toggling this helpsesh session variable to make the jquery work
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$ne: "somedaymaybeproj"}}]}, {sort: {tags: "kickstarterless", rank: 1}})
  },
  kickstarterlessprojects: function () {
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: "kickstarterless"}, {tags: "pip"}]}, {sort: {rank: 1}})
  },
  orgtasks: function () {
      return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: this.project, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {tags: "kickstart", tags: "checklistitem", tags: "milestone", rank: 1}})
  },
  kickstartertask: function () {
    if (Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project})) {
      return Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project}, {$sort: {rank: 1}, limit: 1})
    }
  },
  mits: function () {
    return Taskspending.find({tags: "mit", status: {$in: ["waiting", "pending"]}}, {sort: {rank: 1}})
  },
  projopen: function () {
    return Session.equals('projopen', this.project)
  },
})

Template.focusprojectslist.events({
  'click .sorting_mits': function (e,t) {
    Session.get('sorting_mits', true) ? Session.set('sorting_mits', false) : Session.set('sorting_mits', true)
  },
  'click .kickstart.choosekickstart': function (e,t) {
    Taskspending.update({_id: this._id}, {$push: {tags: "kickstart"}});
    var projectid = Taskspending.findOne({project: this.project, tags: "largeroutcome"})._id
    Taskspending.update({_id: projectid}, {$pull: {tags: "kickstarterless"}})
  },
  'click .kickstart.btn-danger': function (e,t) {
    Taskspending.update({_id: this._id}, {$pull: {tags: "kickstart"}})
    var projectid = Taskspending.findOne({project: this.project, tags: "largeroutcome"})._id
    Taskspending.update({_id: projectid}, {$push: {tags: "kickstarterless"}})
  },
  'keyup #add-newtask-org': function (e,t) {
    if (e.which === 13) {
      var formattednow = formattedNow()
      var uuid = guid()
      var context = e.target.parentElement.children[1].placeholder
      if (e.target.parentElement.children[1].value != '') {
        context = e.target.parentElement.children[1].value
      }
      if (context) {
        Tasksbacklog.insert({owner: Meteor.userId(), project: this.project, description: e.target.value, entry: formattednow, status: "pending", context: context, uuid: uuid})
        Taskspending.insert({owner: Meteor.userId(), project: this.project, description: e.target.value, entry: formattednow, status: "pending", context: context, uuid: uuid})
      } else {
        alert('no context')
      }
      e.target.value = ''
      e.target.parentElement.children[1].value = ''
    }
  },
  'keyup #add-newtask-context-org': function (e,t) {
    if (e.which === 13) {
      var formattednow = formattedNow()
      var uuid = guid()
      var description = e.target.parentElement.children[0].value
      if (e.target.parentElement.children[0].value && (e.target.value != '')) {
      Tasksbacklog.insert({owner: Meteor.userId(), project: this.project, context: e.target.value, entry: formattednow, status: "pending", description: description, uuid: uuid})
      Taskspending.insert({owner: Meteor.userId(), project: this.project, context: e.target.value, entry: formattednow, status: "pending", description: description, uuid: uuid})
      } else {
        alert('missing description or context')
      }
      e.target.parentElement.children[0].value = ''
      e.target.value = ''
    }
  },
  'click .review-btn': function(e,t) {
     Session.set('review_dialog_1',true);
   },
  'click .main-review .projpip': function (e,t){
    taskid = Taskspending.findOne({project: this.project, tags:"largeroutcome"})._id
    Taskspending.update({_id: taskid}, {$pull: {tags: "pip"}})
    var project = this.project
    if (Taskspending.findOne({project: this.project, tags: "mit"})) {
      Meteor.call('pullprojwip', this.project)
//      Taskspending.update({_id: Taskspending.findOne({project: this.project, wip: "projwip"}, {$sort: {tags: "kickstart"}})._id}, {$pull: {wip: "projwip"}})
    }
  },
  'click .main-review .projclose': function (e,t){
    var tasktest = Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
    var taskid = tasktest ? tasktest._id : ''
    if (taskid != '') {
      Taskspending.update({_id: taskid}, {$pull: {tags: "somedaymaybeproj"}})
    }
    else {
      taskid = Taskspending.findOne({project: this.project, tags:"largeroutcome"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybeproj"}})
    }
  },
  'click .reviewproject': function (e,t) {
    if (Session.equals('projopen', this.project)) {
    if (!$('.active-project.nokickstarttask')) {
      Session.set('projopen',false)
    } else {
      var nokickstartproj = Taskspending.findOne({_id: $('.active-project.nokickstarttask .task_item button').last().attr('id')})
      if (nokickstartproj) {
        Session.set('projopen', nokickstartproj.project)
      } else {
        Session.set('projopen', false)
      }
    }
    $('.active-project.nokickstarttask').detach().prependTo('ul#project_list')
    $('.active-project.kickstarttask').detach().appendTo('ul#project_list')
    } else {
      Session.set('projopen', this.project);
    }
  },
  'click .startprocessing-button': selectTaskProcessing,
  'click .closeprojectssection': function(e,t){
    Session.set('projectshidden', true)
  },
});

Template.focusprojectslist.rendered = function () {
Meteor.subscribe("taskspendingdocuments")
/*
  Deps.autorun(function() {
    Session.get('helpsesh')
    $('.active-project.nokickstarttask').detach().prependTo('ul#project_list')
    $('.active-project.kickstarttask').detach().appendTo('ul#project_list')
})
*/

Deps.autorun(function() {
if (Session.equals('sorting_mits', true)) {
  //jquery sortable code, using sortable meteor package
  this.$('.mit_task_list').sortable({
    stop: function(e, ui) {
      // get the dragged html element and the one before
      //   and after it
      el = ui.item.get(0)
      before = ui.item.prev().get(0)
      after = ui.item.next().get(0)

      // Here is the part that blew my mind!
      //  Blaze.getData takes as a parameter an html element
      //    and will return the data context that was bound when
      //    that html element was rendered!
      if(!before) {
        //if it was dragged into the first position grab the
        // next element's data context and subtract one from the rank
        newRank = Blaze.getData(after).rank - 1
      } else if(!after) {
        //if it was dragged into the last position grab the
        //  previous element's data context and add one to the rank
        newRank = Blaze.getData(before).rank + 1
      }
      else
        //else take the average of the two ranks of the previous
        // and next elements
        newRank = (Blaze.getData(after).rank +
                   Blaze.getData(before).rank)/2
      //update the dragged Item's rank
      Taskspending.update({_id: Blaze.getData(el)._id}, {$set: {rank: newRank}})
      proj = Taskspending.findOne({project: Blaze.getData(el).project, tags: "largeroutcome"})
      if (proj && !proj.rank) {
        Taskspending.update({_id: proj._id}, {$set: {rank: newRank}})
      } else if (proj && Taskspending.findOne({project: Blaze.getData(el).project}, {sort: {rank: -1}}).rank >= newRank) {
        Taskspending.update({_id: proj._id}, {$set: {rank: newRank}})
      }
    }
  })
  // end of sortable code
  this.$('.mit_task_list').sortable('enable')
  } else {
    this.$('.mit_task_list').sortable()
    this.$('.mit_task_list').sortable('disable')
  }
})
}


// begin modular subscription loading

Template.focusprojectslist.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.focusprojectslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var focusprojectslimit = instance.focusprojectslimit.get();

    // console.log("Asking for "+focusprojectslimit+" MITs…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingfocusprojects')

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+focusprojectslimit+" MITs. \n\n")
      instance.loaded.set(focusprojectslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingfocusprojects = function() {
    var focusprojectslimit = instance.focusprojectslimit.get()

    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: "pip"}, {tags: {$ne: "kickstarterless"}}]}, {sort: {rank: 1}, limit: focusprojectslimit})
    }
    else {
      var aorprojects = new Array()
      Taskspending.find({_id: {$in: aorfocus}}).forEach(function (doc) {
        aorprojects.push(doc.project)
        Taskspending.find({tags: "largeroutcome", aor: doc._id}).forEach(function (doc) {
          aorprojects.push(doc.project)
        })
      })
      return Taskspending.find({project: {$in: aorprojects}, $and: [{tags: "largeroutcome"}, {tags: "pip"}, {tags: {$ne: "kickstarterless"}}]}, {sort: {rank: 1}, limit: focusprojectslimit})

    }
  }

};

Template.focusprojectslist.helpers({
  // the posts cursor
  projects: function () {
    // Session.set('helpsesh',true)
    // Session.set('helpsesh',false)
    //toggling this helpsesh session variable to make the jquery work
    return Template.instance().taskspendingfocusprojects();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingfocusprojects().count() >= Template.instance().focusprojectslimit.get();
  }
});

Template.focusprojectslist.events({
  'click .load-more-focusprojects': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var focusprojectslimit = instance.focusprojectslimit.get();

    // increase limit by 5 and update it
    focusprojectslimit += 5;
    instance.focusprojectslimit.set(focusprojectslimit)
  }
});

// end modular subscription loading

