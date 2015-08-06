Session.set('processing_task', false)
Session.set('documentediting', false)
Session.set('sorting_mits', false)
Session.setDefault('calendarview', "24")

Template.projectslist.helpers({
  tasks: function () {
//    Session.set('helpsesh',true)
//    Session.set('helpsesh',false)
    //toggling this helpsesh session variable to make the jquery work
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$ne: "somedaymaybeproj"}}]}, {sort: {tags: "kickstarterless", rank: 1}})
  },
  kickstarterlessprojects: function () {
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: "kickstarterless"}, {tags: {$nin: ["pip", "aor", "somedaymaybeproj"]}}]}, {sort: {rank: 1}})
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

Template.documenteditingdialog.helpers({
  documenteditingdialog: function () {
    return Session.get('documentediting');
  }
})

Template.checklisteditingdialog.helpers({
  checklisteditingdialog: function () {
    return Session.get('checklistediting');
  }
})

Template.alarmseteditingdialog.helpers({
  alarmseteditingdialog: function () {
    return Session.get('alarmsetediting');
  }
})

Template.process.helpers({
  waiting: function () {
    if (!this.wait) {
      return false
    }
    var formattednow = formattedNow()
    var string = this.wait
    var string = string.split("T")[0] + string.split("T")[1]
    var string = string.split("Z")[0]
    return (string > formattednow)
  }
})


Template.project_item.events({
  'click .project_item li': function (e,t) {
    if (this.type == 'textfile') {
      Session.set('documentediting', this._id)
    } else if (this.type == 'checklist') {
      Session.set('checklistediting', this._id)
    } else if (this.type == 'alarmset') {
      Session.set('alarmsetediting', this._id)
    }
  },
});

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
  'click .startprocessing-button': selectTaskProcessing
});

Template.projectslist.events({
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
    Taskspending.update({_id: taskid}, {$push: {tags: "pip"}})
    if (Taskspending.findOne({project: this.project, tags: "mit"})) {
      Meteor.call('pushprojwip', this.project)
//      Taskspending.update({_id: Taskspending.findOne({project: this.project, tags: "mit"}, {$sort: {tags: "kickstart"}})._id}, {$push: {wip: "projwip"}})
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

Template.projectslist.rendered = function () {
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

Template.projectslist.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.projectslimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var projectslimit = instance.projectslimit.get();

    // console.log("Asking for "+projectslimit+" MITs…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingprojects')

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+projectslimit+" MITs. \n\n")
      instance.loaded.set(projectslimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingprojects = function() {
    var projectslimit = instance.projectslimit.get()

    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$nin: ["pip", "aor", "somedaymaybeproj", "kickstarterless"]}}]}, {sort: {rank: 1}, limit: projectslimit})
    }
    else {
      var aorprojects = new Array()
      Taskspending.find({_id: {$in: aorfocus}}).forEach(function (doc) {
        aorprojects.push(doc.project)
        Taskspending.find({tags: "largeroutcome", aor: doc._id}).forEach(function (doc) {
          aorprojects.push(doc.project)
        })
      })
      return Taskspending.find({project: {$in: aorprojects}, $and: [{tags: "largeroutcome"}, {tags: {$nin: ["pip", "aor", "somedaymaybeproj", "kickstarterless"]}}]}, {sort: {rank: 1}, limit: projectslimit})

    }


//    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$nin: ["pip", "aor", "somedaymaybeproj", "kickstarterless"]}}]}, {sort: {rank: 1}, limit: projectslimit})
  }

};

Template.projectslist.helpers({
  // the posts cursor
  projects: function () {
    // Session.set('helpsesh',true)
    // Session.set('helpsesh',false)
    //toggling this helpsesh session variable to make the jquery work
    return Template.instance().taskspendingprojects();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingprojects().count() >= Template.instance().projectslimit.get();
  }
});

Template.projectslist.events({
  'click .load-more-projects': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var projectslimit = instance.projectslimit.get();

    // increase limit by 5 and update it
    projectslimit += 5;
    instance.projectslimit.set(projectslimit)
  }
});

// end modular subscription loading

