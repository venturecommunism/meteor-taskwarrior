Meteor.methods({
  pullcontwip: function (context) {
    Taskspending.update({context: context, wip: "contwip"}, {$pull: {wip: "contwip"}}, {multi: true})
  },
})
