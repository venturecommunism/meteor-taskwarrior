Meteor.subscribe("taskspendingdocuments")

Template.timeviewprojectitem.events({
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
