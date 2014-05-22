Template.context_picker.contexts = function(){
  var myArray = Taskspending.find({context: {$exists: 1}}).fetch();
  var distinctArray = _.uniq(myArray, false, function(d) {return d.context});
  var distinctValues = _.pluck(distinctArray, 'context');
  return distinctValues
};

Template.context_picker.rendered = function() {
  Meteor.typeahead.inject('.typeahead');
}

Template.context_picker.context = function () {
  return Session.get('do_context')
}

Template.context_picker.events({
  'keyup .typeahead': function (e,t){
    if (e.which === 13)
      {
        Session.set('do_context',e.target.value)
      }
  },
});

