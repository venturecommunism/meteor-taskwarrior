Template.project_picker.helpers({
  projects: function(){
    var myArray = Taskspending.find({tags: "largeroutcome", project: {$exists: 1}}).fetch();
    var distinctArray = _.uniq(myArray, false, function(d) {return d.project});
    var distinctValues = _.pluck(distinctArray, 'project');
    return distinctValues
  }
})

Template.project_picker.rendered = function() {
  Meteor.typeahead.inject()
}

Template.project_picker.events({
  'keyup .typeahead': function (e,t){
    if (e.which === 13)
      {
        if (e.target.value == '') {
          Taskspending.update({_id: this._id}, {$unset: {project: 1}})
        } else {
console.log("actually this is what's happening")
          Taskspending.update({_id: this._id}, {$set: {project: e.target.value}})
        }
      }
  },
});

