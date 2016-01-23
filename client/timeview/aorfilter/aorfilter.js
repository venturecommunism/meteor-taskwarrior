Template.aorfilter.helpers({
  aor: function() {
    return Taskspending.find({tags: "aor"}, {sort: {weeklyreviewchecked: 1, rank:1}})
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
  aorinboxcount: function () {
    if (Session.equals("energylevel", "calendaronly") && Taskspending.findOne({project: this.project, tags: "aorinbox"})) {
      return 'btn-danger'
    }
  },
})

Template.aorfilter.events({
  'click .closeweeklyreviewsection': function() {
    Session.set('weeklyreviewhidden', true)
  },
  'click .weeklyreview': function(e,t) {
    if (Taskspending.findOne({_id: this._id, tags: "aorfocus"})) {
      Taskspending.update({_id: this._id}, {$pull: {tags: "aorfocus"}})
    } else {
      var oldtask = Taskspending.findOne({tags: "aorfocus"})
      if (oldtask) {
        Taskspending.update({_id: oldtask._id}, {$pull: {tags: "aorfocus"}})
      }
      Taskspending.update({_id: this._id}, {$push: {tags: "aorfocus"}})
    }
  },
  'change [type=checkbox]': function(e,t) {
    if (this._id && Taskspending.findOne({_id: this._id, tags: "aor"})) {
      if (Taskspending.findOne({_id: this._id}).weeklyreviewchecked == "yes") {
        Taskspending.update({_id: this._id}, {$set: {weeklyreviewchecked: "no"}})
      }
      else {
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
