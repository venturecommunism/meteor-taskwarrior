Template.do.is_doing = function () {
  return Session.get('do_status')
}

Template.do.tasks = function () {
  if (Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {project: {$exists: false}}, {context: Session.get('do_context')}]})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]})
  }
}

Template.do.tasks2 = function () {
  if (Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: Session.get('do_context')}]})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: {$exists: false}}]})
  }
}

Template.do.events({
  'click .startprocessing-button': selectTaskProcessing,
});

Template.do.largeroutcome = function () {
  if (Taskspending.findOne({project: this.project, tags: "largeroutcome"})) {
    return Taskspending.findOne({project: this.project, tags: "largeroutcome"}).description;
  }
  else {
    return ''
  }
};

Template.do.somedaymaybeproject = function () {
  return Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
}

Template.do.contexts = function () {
  return context_infos()
}


