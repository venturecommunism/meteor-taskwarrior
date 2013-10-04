Template.tlstest.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    tlstest = Meteor.call('tlstest')
    console.log(tlstest)
  }
});
