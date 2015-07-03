Meteor.methods({
  pushcontwip: function (context) {
    Taskspending.update({context: context, tags: "mit"}, {$push: {wip: "contwip"}}, {multi: true})
  },
})
