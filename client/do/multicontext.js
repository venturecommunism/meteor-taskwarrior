Template.multicontext.somedaymaybeproject = function () {
  return Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
}

Template.multicontext.multicontext = function () {
  var multicontext = Session.get("multicontext")
  return multicontext
}

Template.multicontext.multitasks = function () {
  if (!Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.toString()}]}, {sort: {due:1}})
  }
}

Template.multicontext.multitasks2 = function () {
  if (!Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "kickstart"}, {context: this.toString()}]}, {sort: {due:1}})
  }
}

Template.multicontext.projectcolor = function () {
  return "projectcolor"
}

Template.multicontext.mitornot = function () {
  if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
    return 'active'
  }
  else {
    return ''
  }
}

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
