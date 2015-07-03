Meteor.methods({
  pullprojwip: function (project) {
    Taskspending.update({project: project, wip: "projwip"}, {$pull: {wip: "projwip"}}, {multi: true})
  },
})
