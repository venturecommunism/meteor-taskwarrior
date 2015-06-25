Template.context_picker.helpers({
  contexts: function(){
    var myArray = Taskspending.find({tags: "largercontext", context: {$exists: 1}}).fetch();
    var distinctArray = _.uniq(myArray, false, function(d) {return d.context});
    var distinctValues = _.pluck(distinctArray, 'context');
    return distinctValues
  }
})

Template.context_picker.rendered = function() {
  Meteor.typeahead.inject()
}

Template.context_picker.events({
  'keyup .typeahead': function (e,t){
    if (e.which === 13)
      {
        if (e.target.value == '') {
          Taskspending.update({_id: this._id}, {$unset: {context: 1}})
        } else {
          Taskspending.update({_id: this._id}, {$set: {context: e.target.value}})
        }
      }
  },
});

