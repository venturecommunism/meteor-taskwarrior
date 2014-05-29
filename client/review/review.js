Session.set('processing_task', false);

Template.process.events({
  'click #btnAddItem': function (e,t){
    Session.set('list_adding',true);
    Meteor.flush();
    focusText(t.find("#item_to_add"));
  },
  'keyup #item_to_add': function (e,t){
    if (e.which === 13)
      {
        addItem(Session.get('current_list'),e.target.value);
        Session.set('list_adding',false);
      }
  },
  'focusout #item_to_add': function(e,t){
//    Session.set('list_adding',false);
  },
  'click .delete_item': function(e,t){
    removeItem(e.target.id);
  },
  'click .project': function(e,t){
    Session.set('project_input',this.Name);
    Meteor.flush();
    focusText(t.find(".title"),this.project);

  },
  'click .startprocessing-button': selectTaskProcessing
});

Template.review.is_reviewing = function () {
  return Session.get('review_status')
}

Template.process.waiting = function () {
  if (!this.wait) {
    return false
  }
  var formattednow = formattedNow()
  var string = this.wait
  var string = string.split("T")[0] + string.split("T")[1]
  var string = string.split("Z")[0]
  if (string > formattednow) {
    console.log(string)
    console.log(string + 'str was greater than formattednow for ' + this.description)
  }
  console.log(this.description + string > formattednow)
  return (string > formattednow)
}

Template.review.tasks = function () {
  var all_projects = project_infos()
console.log(all_projects)
  var somedaymaybe_projects = somedaymaybe_infos()
var shortened_active_projects = []
for (i=0; i < all_projects.length; i++) {
  shortened_active_projects[i] = all_projects[i].project
}
console.log(shortened_active_projects + ' is shortened_active_projects')
var shortened_somedaymaybe_projects = []
for (i=0; i < somedaymaybe_projects.length; i++) {
  shortened_somedaymaybe_projects[i] = somedaymaybe_projects[i].project
}
var active_projects = []
for(var i = 0; i<shortened_active_projects.length; i++){
    for(var j=0; j<shortened_somedaymaybe_projects.length; j++){
        if(shortened_active_projects[i] != shortened_somedaymaybe_projects[j]){
          active_projects.push({project: shortened_active_projects[i]})
        }
    }
}
console.log("active_projects is " + active_projects)
  return active_projects
}

Template.review.tasks2 = function () {
  console.log(somedaymaybe_infos())
  return somedaymaybe_infos()
}
