Meteor.startup(function () {
  if (Tasks.findOne({ synckey : {$exists: 1}}) == null) {
    Tasks.insert({ synckey: null })
  }
})
