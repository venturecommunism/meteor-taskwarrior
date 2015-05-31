Template.openproject.helpers({
  projopen: function () {
    return Session.equals('projopen', this.project)
  },
  orgtasks: function () {
      return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: this.project, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {tags: "kickstart", tags: "checklistitem", tags: "milestone", rank: 1}})
  },
  kickstartertask: function () {
    if (Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project})) {
      return Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project}, {$sort: {rank: 1}, limit: 1})
    }
  },
})

Template.openproject.events({
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
})
