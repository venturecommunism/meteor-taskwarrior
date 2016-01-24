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
  hasthisweekprojects: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({tags: "largeroutcome"}).count()
      return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$nin: ["aor", "pip"]}}]}, {sort: {rank: 1}}).count()
    }
    else {
      return Taskspending.find({aor: {$in: aorfocus}, $and: [{tags: "largeroutcome"}, {tags: {$nin: ["aor", "pip"]}}]}, {sort: {rank: 1}}).count()
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
  thisweekprojects: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$nin: ["aor", "pip"]}}]}, {sort: {rank: 1}})
    }
    else {
      return Taskspending.find({aor: {$in: aorfocus}, $and: [{tags: "largeroutcome"}, {tags: {$nin: ["aor", "pip"]}}]}, {sort: {rank: 1}})
    }
  },
  projinboxcount: function () {
    if (Session.equals("energylevel", "calendaronly") && Taskspending.findOne({project: this.project, tags: "projinbox"})) {
      return 'btn-danger'
    }
  },
  profilterbuttonactive: function () {
    if (Taskspending.findOne({_id: this._id, tags: "timeviewproject"})){
      return 'btn-inverse'
    }
  },
})

Template.profilter.events({
  'click .profilter': function (e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "timeviewproject"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "timeviewproject"}})
    } else {
      var foundtimeviewproj = Taskspending.findOne({tags: "timeviewproject"})
      if (foundtimeviewproj && foundtimeviewproj._id) {
        Taskspending.update({_id: foundtimeviewproj._id}, {$pull: {tags: "timeviewproject"}})
      }
      Session.set("projopen", this.project)
      Taskspending.update({_id: this._id}, {$push: {tags: "timeviewproject"}})
    }
  },
})
