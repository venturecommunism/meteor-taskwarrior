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
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: this.toString()}]}, {sort: {due:1}})
  }
}

