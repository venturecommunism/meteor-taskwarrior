Template.sync.events({
  'click #sync-inner' : function () {
    // template data, if any, is available in 'this'
    sync = Meteor.call('sync')
    console.log(sync)
  }
});
