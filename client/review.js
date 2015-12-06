Session.set('processing_task', false)
Session.set('documentediting', false)
Session.set('sorting_wips', false)
Session.set('sorting_mits', false)
Session.setDefault('calendarview', "24")
Session.setDefault('inboxhidden', true)
Session.setDefault('previouscalendarhidden', false)
Session.setDefault('calendarhidden', true)
Session.setDefault('nextactionshidden', true)
Session.setDefault('inactivecontextshidden', true)
Session.setDefault('wipshidden', true)
Session.setDefault('mitshidden', true)
Session.setDefault('readandreviewhidden', true)
Session.setDefault('waitingforshidden', true)
Session.setDefault('projectshidden', true)
Session.setDefault('contextcategorieshidden', true)
Session.setDefault('perspectivehidden', true)
Session.setDefault('weeklyreviewhidden', true)
Session.setDefault('somedaymaybeprojectshidden', true)
Session.setDefault('projectlesssomedaymaybeshidden', true)
Session.setDefault('statisticshidden', true)

Template.review.helpers({
  hasaorfocus: function() {
    return Taskspending.findOne({tags: "aorfocus"})
  },
  aorfocus: function() {
    var aorfocus = Taskspending.find({tags: "aorfocus"}).map( function (doc) {
      return doc.description
    })
    return aorfocus
  },
  tasks: function () {
    Session.set('helpsesh',true)
    Session.set('helpsesh',false)
    //toggling this helpsesh session variable to make the jquery work
    return Taskspending.find({$and: [{tags: "largeroutcome"}, {tags: {$ne: "somedaymaybeproj"}}]}, {sort: {rank: 1}})
  },
  orgtasks: function () {
      return Taskspending.find({status: {$in: ["waiting", "pending"]}, project: this.project, tags: {$ne: "inbox"}, type: {$nin: ["textfile", "checklist"]}}, {sort: {tags: "kickstart", tags: "checklistitem", tags: "milestone", rank: 1}})
  },
  kickstartertask: function () {
    if (Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project})) {
      return Taskspending.find({tags: {$in: ["kickstart", "mit"]}, project: this.project}, {$sort: {rank: 1}, limit: 1})
    }
  },
  mits: function () {
    return Taskspending.find({tags: "mit", status: {$in: ["waiting", "pending"]}}, {sort: {rank: 1}})
  },
  is_reviewing: function () {
    return Session.get('review_status')
  },
  projopen: function () {
    return Session.equals('projopen', this.project)
  },
  nokickstart: function () {
    if (!Taskspending.findOne({project: this.project, tags:{$in: ["kickstart", "mit"]}})) {
      Session.set('projopen', this.project)
      return 'nokickstarttask'
    } else {
      return 'kickstarttask'
    }
  },
  somedaymaybetasks: function () {
    return Taskspending.find({context: "somedaymaybe"})
  },
  waitingfortasks: function () {
    return Taskspending.find({context: "waitingfor", $or: [{project: {$exists: 0}}, {project: ""}]})
  },
  sorting_wips: function () {
    if (Session.equals('sorting_wips', true)) {
      return 'btn-primary'
    } else {
      return ''
    }
  },
  sorting_mits: function () {
    if (Session.equals('sorting_mits', true)) {
      return 'btn-primary'
    } else {
      return ''
    }
  },
  inboxhidden: function () {
    return Session.equals("inboxhidden", true)
  },
  previouscalendarhidden: function () {
    return Session.equals("previouscalendarhidden", true)
  },
  calendarhidden: function () {
    return Session.equals("calendarhidden", true)
  },
  nextactionshidden: function () {
    return Session.equals("nextactionshidden", true)
  },
  inactivecontextshidden: function () {
    return Session.equals("inactivecontextshidden", true)
  },
  wipshidden: function () {
    return Session.equals("wipshidden", true)
  },
  mitshidden: function () {
    return Session.equals("mitshidden", true)
  },
  readandreviewhidden: function () {
    return Session.equals("readandreviewhidden", true)
  },
  waitingforshidden: function () {
    return Session.equals("waitingforshidden", true)
  },
  projectshidden: function () {
    return Session.equals("projectshidden", true)
  },
  contextcategorieshidden: function() {
    return Session.equals("contextcategorieshidden", true)
  },
  perspectivehidden: function() {
    return Session.equals("perspectivehidden", true)
  },
  weeklyreviewhidden: function() {
    return Session.equals("weeklyreviewhidden", true)
  },
  somedaymaybeprojectshidden: function() {
    return Session.equals("somedaymaybeprojectshidden", true)
  },
  projectlesssomedaymaybeshidden: function () {
    return Session.equals("projectlesssomedaymaybeshidden", true)
  },
  statisticshidden: function () {
    return Session.equals("statisticshidden", true)
  },
})

Template.documenteditingdialog.helpers({
  documenteditingdialog: function () {
    return Session.get('documentediting');
  }
})

Template.checklisteditingdialog.helpers({
  checklisteditingdialog: function () {
    return Session.get('checklistediting');
  }
})

Template.alarmseteditingdialog.helpers({
  alarmseteditingdialog: function () {
    return Session.get('alarmsetediting');
  }
})

Template.process.helpers({
  waiting: function () {
    if (!this.wait) {
      return false
    }
    var formattednow = formattedNow()
    var string = this.wait
    var string = string.split("T")[0] + string.split("T")[1]
    var string = string.split("Z")[0]
    return (string > formattednow)
  }
})


Template.project_item.events({
  'click .project_item li': function (e,t) {
    if (this.type == 'textfile') {
      Session.set('documentediting', this._id)
    } else if (this.type == 'checklist') {
      Session.set('checklistediting', this._id)
    } else if (this.type == 'alarmset') {
      Session.set('alarmsetediting', this._id)
    }
  },
});

Template.process.events({
  'click #btnAddItem': function (e,t){
    Session.set('list_adding',true);
    Meteor.flush();
    focusText(t.find("#item_to_add"));
  },
  'keyup #item_to_add': function (e,t){
    if (e.which === 13)
      {
        addItem(Session.get('current_list'),e.target.value);
        Session.set('list_adding',false);
      }
  },
  'focusout #item_to_add': function(e,t){
//    Session.set('list_adding',false);
  },
  'click .delete_item': function(e,t){
    removeItem(e.target.id);
  },
  'click .project': function(e,t){
    Session.set('project_input',this.Name);
    Meteor.flush();
    focusText(t.find(".title"),this.project);

  },
  'click .startprocessing-button': selectTaskProcessing
});

Template.review.events({
  'click .sorting_wips': function (e,t) {
    Session.get('sorting_wips', true) ? Session.set('sorting_wips', false) : Session.set('sorting_wips', true)
  },
  'click .sorting_mits': function (e,t) {
    Session.get('sorting_mits', true) ? Session.set('sorting_mits', false) : Session.set('sorting_mits', true)
  },
  'keyup #add-newtask-org': function (e,t) {
    if (e.which === 13) {
      var formattednow = formattedNow()
      var uuid = guid()
      var context = e.target.parentElement.children[1].placeholder
      if (e.target.parentElement.children[1].value != '') {
        context = e.target.parentElement.children[1].value
      }
      if (context) {
        Tasksbacklog.insert({owner: Meteor.userId(), project: this.project, description: e.target.value, entry: formattednow, status: "pending", context: context, uuid: uuid})
        Taskspending.insert({owner: Meteor.userId(), project: this.project, description: e.target.value, entry: formattednow, status: "pending", context: context, uuid: uuid})
      } else {
        alert('no context')
      }
      e.target.value = ''
      e.target.parentElement.children[1].value = ''
    }
  },
  'keyup #add-newtask-context-org': function (e,t) {
    if (e.which === 13) {
      var formattednow = formattedNow()
      var uuid = guid()
      var description = e.target.parentElement.children[0].value
      if (e.target.parentElement.children[0].value && (e.target.value != '')) {
      Tasksbacklog.insert({owner: Meteor.userId(), project: this.project, context: e.target.value, entry: formattednow, status: "pending", description: description, uuid: uuid})
      Taskspending.insert({owner: Meteor.userId(), project: this.project, context: e.target.value, entry: formattednow, status: "pending", description: description, uuid: uuid})
      } else {
        alert('missing description or context')
      }
      e.target.parentElement.children[0].value = ''
      e.target.value = ''
    }
  },
  'click .review-btn': function(e,t) {
     Session.set('review_dialog_1',true);
   },
  'click .main-review .projclose': function (e,t){
    var tasktest = Taskspending.findOne({project: this.project, tags:"somedaymaybeproj"})
    var taskid = tasktest ? tasktest._id : ''
    if (taskid != '') {
      Taskspending.update({_id: taskid}, {$pull: {tags: "somedaymaybeproj"}})
    }
    else {
      taskid = Taskspending.findOne({project: this.project, tags:"largeroutcome"})._id
      Taskspending.update({_id: taskid}, {$push: {tags: "somedaymaybeproj"}})
    }
  },
  'click .startprocessing-button': selectTaskProcessing,
  'click .openinboxsection': function(e,t){
    Session.set('inboxhidden', false)
  },
  'click .openpreviouscalendarsection': function(e,t){
    Session.set('previouscalendarhidden', false)
  },
  'click .opencalendarsection': function(e,t){
    Session.set('calendarhidden', false)
  },
  'click .opennextactionssection': function(e,t){
    Session.set('nextactionshidden', false)
  },
  'click .openinactivecontextssection': function(e,t){
    Session.set('inactivecontextshidden', false)
  },
  'click .closeinactivecontextssection': function(e,t){
    Session.set('inactivecontextshidden', true)
  },
  'click .openwipssection': function(e,t){
    Session.set('wipshidden', false)
  },
  'click .openmitssection': function(e,t){
    Session.set('mitshidden', false)
  },
  'click .openreadandreviewsection': function(e,t){
    Session.set('readandreviewhidden', false)
  },
  'click .openwaitingforssection': function(e,t){
    Session.set('waitingforshidden', false)
  },
  'click .openprojectssection': function(e,t){
    Session.set('projectshidden', false)
  },
  'click .opensomedaymaybeprojectssection': function(e,t){
    Session.set('somedaymaybeprojectshidden', false)
  },
  'click .opencontextcategoriessection': function(e,t){
    Session.set('contextcategorieshidden', false)
  },
  'click .openperspectivesection': function(e,t){
    Session.set('perspectivehidden', false)
  },
  'click .openweeklyreviewsection': function(e,t){
    Session.set('weeklyreviewhidden', false)
  },
  'click .closesomedaymaybeprojectssection': function(e,t){
    Session.set('somedaymaybeprojectshidden', true)
  },
  'click .openprojectlesssomedaymaybessection': function(e,t){
    Session.set('projectlesssomedaymaybeshidden', false)
  },
  'click .openstatisticssection': function(e,t){
    Session.set('statisticshidden', false)
  },
  'click .closestatisticssection': function(e,t){
    Session.set('statisticshidden', true)
  },
});

Template.review.rendered = function () {
/*
  Deps.autorun(function() {
    Session.get('helpsesh')
    $('.active-project.nokickstarttask').detach().prependTo('ul#project_list')
    $('.active-project.kickstarttask').detach().appendTo('ul#project_list')
})
*/

Deps.autorun(function() {
if (Session.equals('sorting_wips', true)) {
  //jquery sortable code, using sortable meteor package
  this.$('.wip_task_list').sortable({
    stop: function(e, ui) {
      // get the dragged html element and the one before
      //   and after it
      el = ui.item.get(0)
      before = ui.item.prev().get(0)
      after = ui.item.next().get(0)

      // Here is the part that blew my mind!
      //  Blaze.getData takes as a parameter an html element
      //    and will return the data context that was bound when
      //    that html element was rendered!
      if(!before) {
        //if it was dragged into the first position grab the
        // next element's data context and subtract one from the rank
        newRank = Blaze.getData(after).rank - 1
      } else if(!after) {
        //if it was dragged into the last position grab the
        //  previous element's data context and add one to the rank
        newRank = Blaze.getData(before).rank + 1
      }
      else
        //else take the average of the two ranks of the previous
        // and next elements
        newRank = (Blaze.getData(after).rank +
                   Blaze.getData(before).rank)/2
      //update the dragged Item's rank
      Taskspending.update({_id: Blaze.getData(el)._id}, {$set: {rank: newRank}})
      proj = Taskspending.findOne({project: Blaze.getData(el).project, tags: "largeroutcome"})
      cont = Taskspending.findOne({context: Blaze.getData(el).context, tags: "largercontext"})
      if (proj && !proj.rank) {
        Taskspending.update({_id: proj._id}, {$set: {rank: newRank}})
      } else if (proj && Taskspending.findOne({project: Blaze.getData(el).project}, {sort: {rank: -1}}).rank >= newRank) {
        Taskspending.update({_id: proj._id}, {$set: {rank: newRank}})
      }
      if (cont && !cont.rank) {
        Taskspending.update({_id: cont._id}, {$set: {rank: newRank}})
      } else if (cont && Taskspending.findOne({context: Blaze.getData(el).context}, {sort: {rank: -1}}).rank >= newRank) {
        Taskspending.update({_id: cont._id}, {$set: {rank: newRank}})
      }
    }
  })
  // end of sortable code
  this.$('.wip_task_list').sortable('enable')
  } else {
    this.$('.wip_task_list').sortable()
    this.$('.wip_task_list').sortable('disable')
  }
})

Deps.autorun(function() {
if (Session.equals('sorting_mits', true)) {
  //jquery sortable code, using sortable meteor package
  this.$('.mit_task_list').sortable({
    stop: function(e, ui) {
      // get the dragged html element and the one before
      //   and after it
      el = ui.item.get(0)
      before = ui.item.prev().get(0)
      after = ui.item.next().get(0)
 
      // Here is the part that blew my mind!
      //  Blaze.getData takes as a parameter an html element
      //    and will return the data context that was bound when
      //    that html element was rendered!
      if(!before) {
        //if it was dragged into the first position grab the
        // next element's data context and subtract one from the rank
        newRank = Blaze.getData(after).rank - 1
      } else if(!after) {
        //if it was dragged into the last position grab the
        //  previous element's data context and add one to the rank
        newRank = Blaze.getData(before).rank + 1
      }
      else 
        //else take the average of the two ranks of the previous
        // and next elements
        newRank = (Blaze.getData(after).rank +
                   Blaze.getData(before).rank)/2
      //update the dragged Item's rank
      Taskspending.update({_id: Blaze.getData(el)._id}, {$set: {rank: newRank}})
      proj = Taskspending.findOne({project: Blaze.getData(el).project, tags: "largeroutcome"})
      cont = Taskspending.findOne({context: Blaze.getData(el).context, tags: "largercontext"})
      if (proj && !proj.rank) {
        Taskspending.update({_id: proj._id}, {$set: {rank: newRank}})
      } else if (proj && Taskspending.findOne({project: Blaze.getData(el).project}, {sort: {rank: -1}}).rank >= newRank) {
        Taskspending.update({_id: proj._id}, {$set: {rank: newRank}})
      }
      if (cont && !cont.rank) {
        Taskspending.update({_id: cont._id}, {$set: {rank: newRank}})
      } else if (cont && Taskspending.findOne({context: Blaze.getData(el).context}, {sort: {rank: -1}}).rank >= newRank) {
        Taskspending.update({_id: cont._id}, {$set: {rank: newRank}})
      }
    }
  })
  // end of sortable code
  this.$('.mit_task_list').sortable('enable')
  } else {
    this.$('.mit_task_list').sortable()
    this.$('.mit_task_list').sortable('disable')
  }
})
}

