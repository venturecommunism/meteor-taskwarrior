Template.multicontext.helpers({
  somedaymaybeproject: function () {
    return Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
  },
  multicontext: function () {
    var multicontext = Session.get("multicontext")
    return multicontext
  },
  multitasks: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.toString()}]}, {sort: {rank: -1}})
  },
  multitasks2: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "kickstart"}, {context: this.toString()}]}, {sort: {rank: {$exists: true}, rank: 1}})
  },
  projectcolor: function () {
    return "projectcolor"
  },
  mitornot: function () {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      return 'active'
    }
    else {
      return ''
    }
  }
})

Template.multicontext.events({
  'click #mit': function (e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "mit"}})
    }
    else {
      Taskspending.update({_id: this._id}, {$push: {tags: "mit"}})
    }
  }
})
