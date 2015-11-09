Template.date.helpers({
  date: function () {
    return 'Date and time is ' + timestamptomoment(Session.get('now')).format()
  },
})

Meteor.startup(function() {
  Session.set('now', formattedNow())

  Meteor.setInterval(function() {
    Session.set('now', formattedNow())
  }, 500)
})
