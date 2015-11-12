Template.weeklyreview.helpers({
  aor: function() {
    return Taskspending.find({tags: "aor"}, {sort: {rank:1}})
  },
  weeklyreviewcheck: function () {
    if (this._id && (Taskspending.findOne({_id: this._id}).weeklyreviewchecked == "yes")) {
      return "yes"
    }
  },
  weeklyreviewbuttonactive: function () {
    if (Taskspending.findOne({_id: this._id, tags: "aorfocus"})){
      return 'btn-inverse'
    }
  },
})

Template.weeklyreview.events({
  'click .closeweeklyreviewsection': function() {
    Session.set('weeklyreviewhidden', true)
  },
  'click .weeklyreview': function(e,t) {
    Taskspending.update({_id: this._id}, {$push: {tags: "aorfocus"}})
    Taskspending.find({tags: "aorfocus", _id: {$ne: this._id}}).forEach( function (doc) {
      Taskspending.update({_id: doc._id}, {$pull: {tags: "aorfocus"}})
    })
    Session.set("wipshidden", false)
    Session.set("mitshidden", false)
    Session.set("nextactionshidden", false)
    Session.set("projectshidden", false)
    Session.set("readandreviewhidden", false)
    Session.set("waitingforshidden", false)
    Session.set("projectlesssomedaymaybeshidden", false)    
  },
  'change [type=checkbox]': function(e,t) {
    if (this._id && Taskspending.findOne({_id: this._id, tags: "aor"})) {
      if (Taskspending.findOne({_id: this._id}).weeklyreviewchecked == "yes") {
        Taskspending.update({_id: this._id}, {$set: {weeklyreviewchecked: "no"}})
      }
      else {
        Session.set("wipshidden", false)
        Session.set("mitshidden", false)
        Session.set("nextactionshidden", false)
        Session.set("projectshidden", false)
        Session.set("readandreviewhidden", false)
        Session.set("waitingforshidden", false)
        Session.set("projectlesssomedaymaybeshidden", false)
        var aorrank = this.rank
console.log(aorrank)
        var nexttask = Taskspending.findOne({tags: "aor", rank: {$gt: aorrank}, _id: {$ne: this._id}})
console.log(nexttask._id)
        Taskspending.update({_id: nexttask._id}, {$push: {tags: "aorfocus"}})
        Taskspending.find({tags: "aorfocus", _id: {$ne: nexttask._id}}).forEach( function (doc) {
          Taskspending.update({_id: doc._id}, {$pull: {tags: "aorfocus"}})
        })
        Taskspending.update({_id: this._id}, {$set: {weeklyreviewchecked: "yes"}})
      }
    }  
console.log(e.target.value)
  },
})
