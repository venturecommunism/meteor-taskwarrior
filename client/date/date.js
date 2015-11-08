Template.date.helpers({
  date: function () {
    return 'Date and time is ' + Session.get('now')
  },
})

Meteor.startup(function() {
  Session.set('now', new Date())

  Meteor.setInterval(function() {
    Session.set('now', new Date())
  }, 500)
})
