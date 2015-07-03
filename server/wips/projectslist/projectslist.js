Meteor.methods({
  pushprojwip: function (project) {
    Taskspending.update({project: project, tags: "mit"}, {$push: {wip: "projwip"}}, {multi: true})
  },
})
