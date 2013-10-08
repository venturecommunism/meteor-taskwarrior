Meteor.subscribe("tasks")
Meteor.subscribe("taskspending")

Template.tasklist.tasks = function () {
  return Taskspending.find({status: "pending"}, {sort: {due: -1}})
}
