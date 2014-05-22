Session.setDefault('project_filter', null);

// Pick out the unique projects from all tasks in pending tasks
Template.project_filter.projects = function () {
  return project_infos();
};

Template.project_filter.project_text = function () {
  if (this.project === null) {
    return "All items"
  }
  else {
    return this.project || "Projectless items";
  }
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


