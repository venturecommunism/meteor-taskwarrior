Template.contextcategories.events({
  'change .contextcategoryselect': function (e,t) {
    console.log(e.target.id)
    var contid = e.target.id.slice(22)
    console.log(contid)
    var selectValue = t.$("#contextcategoryselect-"+contid).val()
    console.log(selectValue)
    Taskspending.update({_id: contid}, {$set: {contextcategory: selectValue}})
  },
  'click .contextcategorytoback': function (e,t) {
    var highestcontextcategory = Taskspending.findOne({tags: "contextcategory"}, {sort: {rank: -1}}).rank
    var currentcontextcategory = Taskspending.findOne({_id: this._id}).rank
    if (currentcontextcategory >= highestcontextcategory) {
    }
    else {
      var newrank = highestcontextcategory + 1
      Taskspending.update({_id: this._id}, {$set: {rank: newrank}})
    }
  },
  'click .contextcategorytofront': function (e,t) {
    var lowestcontextcategory = Taskspending.findOne({tags: "contextcategory"}, {sort: {rank: 1}}).rank
    var currentcontextcategory = Taskspending.findOne({_id: this._id}).rank
    if (currentcontextcategory <= lowestcontextcategory) {
    }
    else {
      var newrank = lowestcontextcategory - 1
      Taskspending.update({_id: this._id}, {$set: {rank: newrank}})
    }
  },
})


Template.contextcategories.events({
  'click .closecontextcategoriessection': function(e,t){
    Session.set('contextcategorieshidden', true)
  },
  'click .newcontextcategory.btn': function(e,t){
    Session.set('editingcontextcategory', true)
    Meteor.flush()
    focusText(t.find("#add-newcontextcategory"))
  },
  'focusout #add-newcontextcategory': function(e,t){
    Session.set('editingcontextcategory', false)
  },
  'keyup #add-newcontextcategory': function (e,t) {
    if (e.which === 13)
    {
      var contextcategoryVal = String(e.target.value || "");
      if (contextcategoryVal)
      {
        var formattednow = formattedNow()
        if (Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}})) {
          var rank = Taskspending.findOne({rank: {$exists: 1}}, {sort: {rank: 1}}).rank - 1
        }
        else {
          var rank = 0
        }
        Tasksbacklog.insert({context: "CONTEXTCATEGORY."+e.target.value, description: e.target.value, owner: Meteor.userId(), entry: formattednow, tags: ['largercontext', 'contextcategory'], rank: rank})
        Taskspending.insert({context: "CONTEXTCATEGORY."+e.target.value, description: e.target.value, owner: Meteor.userId(), entry: formattednow, tags: ['largercontext', 'contextcategory'], rank: rank})
        Session.set('editingcontextcategory', false);
       }
     }
  },
})

Template.contextcategories.helpers({
  contexts: function () {
    return Taskspending.find({$and: [{tags: "largercontext"}, {contextcategory: {$exists: 0}}, {tags: {$ne: "contextcategory"}}]}, {sort: {rank: 1}})
  },
  contextcategory: function() {
    return Taskspending.find({$and: [{tags: "contextcategory"}, {tags: {$ne: "contextcategoryfocus"}}]}, {sort: {rank: 1}})
  },
  new_contextcategory: function() {
    return Session.equals('editingcontextcategory', true)
  },
  contextcategorycontexts: function () {
    return Taskspending.find({$and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: {$ne: "contextcategory"}}]}, {sort: {rank: 1}})
  },
})

