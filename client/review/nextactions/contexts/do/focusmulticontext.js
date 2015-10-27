Template.focusmulticontext.helpers({
  activecontext: function () {
    return !Taskspending.findOne({context: this.toString(), tags: "somedaymaybecont"})
  },
  somedaymaybeproject: function () {
    return Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
  },
  focusmulticontext: function () {
    var focusmulticontext = Session.get("focusmulticontext")
    return focusmulticontext
  },
  multitasks2: function () {
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {project: {$exists: true}}, {context: this.toString()}]}, {sort: {tags: {$in: ["kickstart", "mit"]}, rank: {$exists: true}, rank: 1}})
  },
  projectcolor: function () {
    return "projectcolor"
  },
  mitornot: function () {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      return 'active'
    }
    else {
      return ''
    }
  },
})

Template.focusmulticontext.events({
  'click .mit': function (e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "mit"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "mit"}})
      Taskspending.update({_id: this._id}, {$pull: {wip: "projwip"}})
      Taskspending.update({_id: this._id}, {$pull: {wip: "contwip"}})
    }
    else {
      Taskspending.update({_id: this._id}, {$push: {tags: "mit"}})
      if (Taskspending.findOne({project: this.project, tags: "pip"})) {
        Taskspending.update({_id: this._id}, {$push: {wip: "projwip"}})
      }
      if (Taskspending.findOne({context: this.context, tags: "cip"})) {
        Taskspending.update({_id: this._id}, {$push: {wip: "contwip"}})
      }
    }
  },
  'click .closecontext': function (e,t) {
    var tempcontext = Session.get("focusmulticontext")
      var tempcontextindex = tempcontext.indexOf(String(this))
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("focusmulticontext", tempcontext)
  },
  'click .contclose': function (e,t){
    var tasktest = Taskspending.findOne({context: this.toString(), tags:"somedaymaybecont"})
    var taskid = tasktest ? tasktest._id : ''
    if (taskid != '') {
      Taskspending.update({_id: taskid}, {$pull: {tags: "somedaymaybecont"}})
    }
    else if (tasktest) {
      Taskspending.update({_id: tasktest._id}, {$push: {tags: "somedaymaybecont"}})
    }
    else {
    var tempcontext = Session.get("focusmulticontext")
      var tempcontextindex = tempcontext.indexOf(String(this))
      var splicedtempcontext = tempcontext.splice(tempcontextindex,1)
      Session.set("focusmulticontext", tempcontext)
      var taskid = Taskspending.findOne({context: this.toString(), tags: "largercontext"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybecont"}})
    }
  },
})











