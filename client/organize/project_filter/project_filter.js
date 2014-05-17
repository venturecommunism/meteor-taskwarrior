Session.setDefault('project_filter', null);

// Pick out the unique projects from all tasks in pending tasks
Template.project_filter.projects = function () {
  var project_infos = [];
  var total_count = 0;

//the cursor below doesn't have the formattednow waiting field
  Taskspending.find({status: {$in: ["waiting", "pending"]}, tags: {$not: "inbox"}}, {sort: {due: -1}}).forEach(function (task) {
//the bottom may be for arrays of tags rather than the single project that is allowed
// _.each(task.project, function (project) {
      var project_info = _.find(project_infos, function (x) { return x.project === task.project; });
      if (! project_info)
        project_infos.push({project: task.project, count: 1});
      else
        project_info.count++;
// });
    total_count++;
  });

  project_infos = _.sortBy(project_infos, function (x) { return x.project; });
  project_infos.unshift({project: null, count: total_count});

  return project_infos;
};

Template.project_filter.project_text = function () {
   return this.project || "All items";
};

Template.project_filter.events({
  'mousedown .project': function () {
    if (Session.equals('project_filter', this.project))
      Session.set('project_filter', null);
    else
      Session.set('project_filter', this.project);
  }
});

Template.project_filter.selected = function () {
  return Session.equals('project_filter', this.project) ? 'active btn-danger' : '';
};


