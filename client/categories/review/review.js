Template.categories.review_status = function () {
  return Session.equals('review_status',true) ? 'active' : ''
}

Template.categories.events({
  'click #review': function (e, t) {
    Session.set('review_status', true)
  }
})

//Template.categories.events({
//  'click #review': function (e, t) {
Deps.autorun(function(){
if (Session.equals('review_status', true)) {
if (Taskspending.findOne({tags: "inbox"})) {
      Toast.success('Step 1: Process your inbox', 'Daily Review', {displayDuration: 5000});
      Session.set('organize_status', false);
      Session.set('review_status', false);
      Session.set('do_status', false);
      Session.set('process_status', true)
      return;
    }


var index
var real_project
for (index = 0; index < project_infos().length; ++index) {
  if (project_infos()[index].project != null && !Taskspending.findOne({project: project_infos()[index].project, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}]})) {
    real_project = project_infos()[index].project
  }
}

if (real_project != null && !Taskspending.findOne({project: real_project, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}]})) {
      Toast.success('Step 2: Give each project a kickstarter task', 'Daily Review', {displayDuration: 5000});
      Session.set('organize_status', true);
      Session.set('project_filter', real_project)
      Session.set('review_status', false);
      Session.set('do_status', false);
      Session.set('process_status', false)
    }
else {
      Toast.success('Ready for the Daily Review', 'Daily Review', {displayDuration: 5000});
      Session.set('organize_status', false);
      Session.set('review_status', true);
      Session.set('do_status', false);
      Session.set('process_status', false)
    }
}})
// },
//});

