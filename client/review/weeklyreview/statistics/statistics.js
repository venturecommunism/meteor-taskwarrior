Meteor.subscribe('taskspendingcount' )
Meteor.subscribe('inboxcount')
Meteor.subscribe('calendarcount')
Meteor.subscribe('hasbothcontandprojcount')

Template.statistics.helpers({
  taskspendingcount: function () {
    return Counts.get('taskspendingcount')
  },
  inboxcount: function () {
    if (Counts.has('inboxcount')) {
      return Counts.get('inboxcount')
    } else {
      return 'no Inbox counter'
    }
  },
  calendarcount: function () {
    if (Counts.has('calendarcount')) {
      return Counts.get('calendarcount')
    } else {
      return 'no Calendar counter'
    }
  },
  contandprojcount: function () {
    return Counts.get('hasbothcontandprojcount')
  },
})

Template.statistics.events({
})
