Template.do.is_doing = function () {
  return Session.get('do_status')
}

Template.do.tasks = function () {
  if (Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {project: {$exists: false}}, {context: Session.get('do_context')}]})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: {$exists: false}}]}, {sort: {due:1}})
  }
}

Template.do.tasks2 = function () {
  if (Session.get('do_context')){
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: Session.get('do_context')}]})
  }
  else {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}, {context: {$exists: false}}]}, {sort: {due:1}})
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


Template.do.duedate = function () {
if (this.due) {
var newstringpartsT = this.due.split("T")
var newstringpartsZ = newstringpartsT[1].split("Z")
var newstringwhole = newstringpartsT[0] + newstringpartsZ[0]
  return newstringpartsT[0].substring(4,6) +'/'+ newstringpartsT[0].substring(6,8) +'/'+ newstringpartsT[0].substring(0,4)
}
else {
return false
}
}
