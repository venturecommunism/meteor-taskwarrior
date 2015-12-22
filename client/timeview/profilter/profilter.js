Template.profilter.helpers({
  hasprojects: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: "pip"}]}, {sort: {rank: 1}}).count()
    }
    else {
      return Taskspending.find({aor: {$in: aorfocus}, $and: [{tags: "largeroutcome"}, {tags: "pip"}]}, {sort: {rank: 1}}).count()
    }
  },
  projects: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: "pip"}]}, {sort: {rank: 1}})
    }
    else {
      return Taskspending.find({aor: {$in: aorfocus}, $and: [{tags: "largeroutcome"}, {tags: "pip"}]}, {sort: {rank: 1}})
    }
  },
  projinboxcount: function () {
    if (Session.equals("energylevel", "calendaronly") && Taskspending.findOne({project: this.project, tags: "projinbox"})) {
      return 'btn-danger'
    }
  },
})

Template.profilter.events({
  'click .profilter': function (e,t) {
    console.log(this.project)
  },
})
