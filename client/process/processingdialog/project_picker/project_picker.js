Template.project_picker.projects = function(){
//return project_infos()

  var myArray = Taskspending.find({tags: "largeroutcome", project: {$exists: 1}}).fetch();

  var distinctArray = _.uniq(myArray, false, function(d) {return d.project});
  var distinctValues = _.pluck(distinctArray, 'project');
  return distinctValues

};


Template.project_picker.rendered = function() {
//$('.typeahead').data({hint:true})
//Meteor.typeahead('.typeahead');
Meteor.typeahead.inject()
}

Template.project_picker.events({
  'keyup .typeahead': function (e,t){
    if (e.which === 13)
      {
        if (e.target.value == '') {
          Taskspending.update({_id: this._id}, {$unset: {project: 1}})
        } else {
          Taskspending.update({_id: this._id}, {$set: {project: e.target.value}})
        }
      }
  },
});

