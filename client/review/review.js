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
  'click .startprocessing-button': selectTaskProcessing
});

Template.review.events({
  'click .review-btn': function(e,t) {
     Session.set('review_dialog_1',true);
   },
  'click .close': function (e,t){
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
    Session.set('projopen', this.project);
  },
});

Template.review.is_reviewing = function () {
  return Session.get('review_status')
}

Template.process.waiting = function () {
  if (!this.wait) {
    return false
  }
  var formattednow = formattedNow()
  var string = this.wait
  var string = string.split("T")[0] + string.split("T")[1]
  var string = string.split("Z")[0]
  return (string > formattednow)
}

Template.review.tasks = function () {
  var active_projects = []
  var all_projects = project_infos()
  var somedaymaybe_projects = somedaymaybe_infos()
  var shortened_all_projects = []
  if (somedaymaybe_projects != '') {
    var shortened_active_projects = []
    for (i=0; i < all_projects.length; i++) {
      shortened_all_projects[i] = all_projects[i].project
    }
    var shortened_somedaymaybe_projects = []
    for (i=0; i < somedaymaybe_projects.length; i++) {
      shortened_somedaymaybe_projects[i] = somedaymaybe_projects[i].project
    }

    shortened_active_projects = shortened_all_projects.filter(function(n) {
      return (shortened_somedaymaybe_projects.indexOf(n) == -1)
    })

    for (var i = 0; i < shortened_active_projects.length; i++) {
      active_projects.push({project: shortened_active_projects[i]})
    }
  }
  else {
    active_projects = all_projects
  }
  return active_projects
}

Template.review.tasks2 = function () {
  return somedaymaybe_infos()
}
