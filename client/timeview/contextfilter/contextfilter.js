Template.contextfilter.helpers({
  hascontexts: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: "cip"}]}, {sort: {rank: 1}}).count()
    }
    else {
      return Taskspending.find({contextaor: {$in: aorfocus}, $and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: "cip"}]}, {sort: {rank: 1}}).count()
    }
  },
  contexts: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: "cip"}]}, {sort: {rank: 1}})
    }
    else {
      return Taskspending.find({contextaor: {$in: aorfocus}, $and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: "cip"}]}, {sort: {rank: 1}})
    }
  },
  contextcategories: function () {
    return Taskspending.find({tags: "contextcategory"}, {sort: {rank: 1}})
  },
  fullfocusmulticontext: function () {
    if (Session.get("focusmulticontext") && Session.get("focusmulticontext").length == Taskspending.find({$and: [{tags: "largercontext"}, {tags: {$nin: ["somedaymaybecont"]}}]}).count()) {
      return true
    }
  },
  in_focusmulticontext: function () {
    if (Session.get("focusmulticontext")) {
      if (Session.get("focusmulticontext").indexOf(this.context) > -1) {
        return true;
      }
      else {
        return false;
      }
    }
  },
})

Template.contextfilter.events({
  'click #focuscontextpicker li .btn': function (e,t) {
    tempcontext = Session.get("focusmulticontext")
    if (!tempcontext) {
      Session.set("focusmulticontext", [this.context])
    }
    else if (tempcontext.length == 0) {
      Session.set("focusmulticontext", [this.context])
    }
    else if (Session.get("focusmulticontext").indexOf(this.context) < 0) {
      tempcontext.push(this.context)
      Session.set("focusmulticontext", tempcontext)
    }
    else {
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("focusmulticontext", tempcontext)
    }
  },
  'click .contcip': function (e,t){
    contid = Taskspending.findOne({context: this.context, tags:"largercontext"})._id
    Taskspending.update({_id: contid}, {$pull: {tags: "cip"}})
    Meteor.call('pullcontwip', this.context)
  },
  'click .contclose': function (e,t){
    var tasktest = Taskspending.findOne({context: this.context, tags:"somedaymaybecont"})
    var taskid = tasktest ? tasktest._id : ''
    if (taskid != '') {
console.log(taskid)
      Taskspending.update({_id: taskid}, {$pull: {tags: "somedaymaybecont"}})
    }
    else if (tasktest) {
console.log(tasktest.description)
      Taskspending.update({_id: tasktest._id}, {$push: {tags: "somedaymaybecont"}})
    }
    else if (Session.get("focusmulticontext").indexOf(this.context) > 0) {
console.log(Session.get("focusmulticontext"))
    var tempcontext = Session.get("focusmulticontext")
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("focusmulticontext", tempcontext)
      var taskid = Taskspending.findOne({context: this.context, tags: "largercontext"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybecont"}})
    }
    else {
      var taskid = Taskspending.findOne({context: this.context, tags: "largercontext"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybecont"}})
    }
  },
  'click .closefocusnextactionssection': function(e,t){
    Session.set('nextactionshidden', true)
  },
})
