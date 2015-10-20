Template.contextpicker.helpers({
  hascontexts: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
//console.log("THE THINGIE IS " + Object.keys(this.data) + " " + this.data._id)
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: {$nin: ["cip", "somedaymaybecont", "contextcategory"]}}]}, {sort: {rank: 1}}).count()
    }
    else {
      return Taskspending.find({$and: [{contextaor: {$in: aorfocus}}, {tags: "largercontext"}, {contextcategory: this._id}, {tags: {$nin: ["cip", "somedaymaybecont", "contextcategory"]}}]}, {sort: {rank: 1}}).count()
    }
  },
  contexts: function () {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
//console.log("THE THINGIE IS " + Object.keys(this.data) + " " + this.data._id)
    if (aorfocus == '' || !aorfocus || aorfocus == []) {
      return Taskspending.find({$and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: {$nin: ["cip", "somedaymaybecont", "contextcategory"]}}]}, {sort: {rank: 1}})
    }
    else {
      return Taskspending.find({contextaor: {$in: aorfocus}, $and: [{tags: "largercontext"}, {contextcategory: this._id}, {tags: {$nin: ["cip", "somedaymaybecont", "contextcategory"]}}]}, {sort: {rank: 1}})
    }
  },
  contextcategories: function () {
    return Taskspending.find({tags: "contextcategory"}, {sort: {rank: 1}})
  },
  fullmulticontext: function () {
    if (Session.get("multicontext") && Session.get("multicontext").length == Taskspending.find({$and: [{tags: "largercontext"}, {tags: {$nin: ["somedaymaybecont"]}}]}).count()) {
      return true
    }
  },
  count: function () {
    return (Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: {$in: ["kickstart", "mit"]}}, {context: this.context}]}, {sort: {rank: {$exists: true}, rank: 1}}).count() + Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$ne: "inbox"}}, {project: {$exists: false}}, {context: this.context}]}, {sort: {rank: -1}}).count() + '/' + Taskspending.find({context: this.context, tags: {$nin: ["largercontext"]}}).count() + ' visible')
//    return Taskspending.find({context: this.context}).count()
  },
  in_multicontext: function () {
    if (Session.get("multicontext")) {
      if (Session.get("multicontext").indexOf(this.context) > -1) {
        return true;
      }
      else {
        return false;
      }
    }
  },
// aor is no longer in use but it used to also pick contexts from anyaor
  aor: function () {
    var aorlist = Taskspending.findOne({context: this.context, tags: "largercontext"})
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map( function (doc) {
      return doc._id
    })
    if (aorlist.contextaor) {
      var inaorfocus = aorfocus.some(function (e) {
        return aorlist.contextaor.indexOf(e) >= 0;
      })
    }
    if (!Taskspending.findOne({tags: "aorfocus"}) || Taskspending.findOne({context: this.context, tags: "anyaor"}) || inaorfocus) {
      return true
    }
  },
  contexts1: function () {
    return context_infos()
  },
  editing_contextlocation: function () {
    return Session.equals('editing_contextlocation',this._id)
  },
})

Template.contextpicker.events({
  'click #contextpicker li .btn': function (e,t) {
    tempcontext = Session.get("multicontext")
    if (!tempcontext) {
      Session.set("multicontext", [this.context])
    }
    else if (tempcontext.length == 0) {
      Session.set("multicontext", [this.context])
    }
    else if (Session.get("multicontext").indexOf(this.context) < 0) {
      tempcontext.push(this.context)
      Session.set("multicontext", tempcontext)
    }
    else {
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("multicontext", tempcontext)
    }
  },
  'click .contcip': function (e,t){
    contid = Taskspending.findOne({context: this.context, tags:"largercontext"})._id
    Taskspending.update({_id: contid}, {$push: {tags: "cip"}})
    Meteor.call('pushcontwip', this.context)
  },
  'click .contclose': function (e,t){
    var tasktest = Taskspending.findOne({context: this.context, tags:"somedaymaybecont"})
    var taskid = tasktest ? tasktest._id : ''
    if (taskid != '') {
      Taskspending.update({_id: taskid}, {$pull: {tags: "somedaymaybecont"}})
    }
    else if (tasktest) {
      Taskspending.update({_id: tasktest._id}, {$push: {tags: "somedaymaybecont"}})
    }
    else if (Session.get("multicontext").indexOf(this.context) > 0) {
    var tempcontext = Session.get("multicontext")
      var tempcontextindex = tempcontext.indexOf(this.context)
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("multicontext", tempcontext)
      var taskid = Taskspending.findOne({context: this.context, tags: "largercontext"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybecont"}})
    }
    else {
      var taskid = Taskspending.findOne({context: this.context, tags: "largercontext"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybecont"}})
    }
  },
  'click #btnContextLocation': function (e,t) {
    Session.set('editing_contextlocation', this._id);
    Meteor.flush();
    focusText(t.find("#editing-contextlocation"));
  },
  'keyup #editing-contextlocation': function (e,t) {
    if (e.which === 13)
    {
      var contextLocationVal = String(e.target.value || "");
      if (contextLocationVal)
      {
        var formattednow = formattedNow()
        if (Taskspending.findOne({navigatingto: this._id})) {
          var taskid = Taskspending.findOne({navigatingto: this._id})._id
          Taskspending.update({_id:taskid}, {$set: {contextlocation: e.target.value}})
        }
        else {
          var description = "Navigate to " + this.context
          Taskspending.insert({owner: Meteor.userId(), navigatingto: this._id, context: "navigation", contextlocation: e.target.value, description: description, tags: ["kickstart"]})
        }
        Session.set('editing_contextlocation', false);
       }
     }
  },
  'focusout #editing-contextlocation' : function(e,t){
    Session.set('editing_contextlocation',false);
  },
})

// begin modular subscription loading

Template.contextpickerspecificcategory.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.contextpickerlimit = new ReactiveVar(5);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var contextpickerlimit = instance.contextpickerlimit.get();

    // console.log("Asking for "+contextpickerlimit+" posts…")

    // subscribe to the posts publication
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      var subscription = instance.subscribe('taskspendingcontextpicker', contextpickerlimit)
    }
    else {
      var subscription = instance.subscribe('taskspendingcontextpicker', contextpickerlimit)
    }
    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      // console.log("> Received "+contextpickerlimit+" posts. \n\n")
      instance.loaded.set(contextpickerlimit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.taskspendingcontextpicker = function() {
    var contextpickerlimit = instance.contextpickerlimit.get()
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map(function (doc) {
      return doc._id
    })
    if (aorfocus == '') {
      return Taskspending.find({$and: [{tags: "largercontext"}, {tags: {$nin: ["cip", "somedaymaybecont", "contextcategory"]}}]}, {sort: {rank: 1}, limit: contextpickerlimit})
    }
    else {
      return Taskspending.find({$and: [{contextaor: {$in: aorfocus}}, {tags: "largercontext"}, {tags: {$nin: ["cip", "somedaymaybecont", "contextcategory"]}}]}, {sort: {rank: 1}, limit: contextpickerlimit})
    }
  }

};

Template.contextpickerspecificcategory.helpers({
  // the posts cursor
  contexts: function () {
    return Template.instance().taskspendingcontextpicker();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().taskspendingcontextpicker().count() >= Template.instance().contextpickerlimit.get();
  }
});

Template.contextpickerspecificcategory.events({
  'click .load-more-contextpicker': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var contextpickerlimit = instance.contextpickerlimit.get();

    // increase limit by 5 and update it
    contextpickerlimit += 5;
    instance.contextpickerlimit.set(contextpickerlimit)
  }
});

// end modular subscription loading

