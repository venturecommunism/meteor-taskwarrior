Template.focuscontextpicker.helpers({
  hascontexts: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
//console.log("THE THINGIE IS " + Object.keys(this.data) + " " + this.data._id)
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
//console.log("THE THINGIE IS " + Object.keys(this.data) + " " + this.data._id)
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
  count: function () {
    return (Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: {$in: ["kickstart", "mit"]}}, {context: this.context}]}, {sort: {rank: {$exists: true}, rank: 1}}).count() + Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.context}]}, {sort: {rank: -1}}).count() + '/' + Taskspending.find({context: this.context, tags: {$nin: ["largercontext"]}}).count() + ' visible')
//    return Taskspending.find({context: this.context}).count()
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
  contexts1: function () {
    return context_infos()
  },
})

Template.focuscontextpicker.events({
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

// begin modular subscription loading

Template.focuscontextpickerspecificcategory.created = function () {

  // 1. Initialization

  var instance = this;
console.log(Object.keys(this) + " is object keys")
  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.focuscontextpickerlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var focuscontextpickerlimit = instance.focuscontextpickerlimit.get();

    // console.log("Asking for "+contextpickerlimit+" posts…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('taskspendingfocuscontextpicker', focuscontextpickerlimit)

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+focuscontextpickerlimit+" posts. \n\n")
      instance.loaded.set(focuscontextpickerlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingfocuscontextpicker = function() {
    var focuscontextpickerlimit = instance.focuscontextpickerlimit.get()

    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
//console.log("THE THINGIE IS " + Object.keys(this.data) + " " + this.data._id)
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largercontext"}, {tags: "cip"}]}, {sort: {rank: 1}, limit: focuscontextpickerlimit})
    }
    else {
      return Taskspending.find({contextaor: {$in: aorfocus}, $and: [{tags: "largercontext"}, {tags: "cip"}]}, {sort: {rank: 1}, limit: focuscontextpickerlimit})
    }
  }

};

Template.focuscontextpickerspecificcategory.helpers({
  // the posts cursor
  contexts: function () {
    return Template.instance().taskspendingfocuscontextpicker();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingfocuscontextpicker().count() >= Template.instance().focuscontextpickerlimit.get();
  }
});

Template.focuscontextpickerspecificcategory.events({
  'click .load-more-focuscontextpicker': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var focuscontextpickerlimit = instance.focuscontextpickerlimit.get();

    // increase limit by 5 and update it
    focuscontextpickerlimit += 5;
    instance.focuscontextpickerlimit.set(focuscontextpickerlimit)
  }
});

// end modular subscription loading

