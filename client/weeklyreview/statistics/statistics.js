Meteor.subscribe('taskspendingcount' )
Meteor.subscribe('inboxcount')
Meteor.subscribe('calendarcount')
Meteor.subscribe('projectlesscalendarcount')
Meteor.subscribe('contextlesscalendarcount')
Meteor.subscribe('projectlesscontextlesscalendarcount')
Meteor.subscribe('hasbothcontandprojcount')
Meteor.subscribe('hascontnotprojcount')
Meteor.subscribe('hasprojnotcontcount')

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
  projectlesscalendarcount: function () {
    if (Counts.has('projectlesscalendarcount')) {
      return Counts.get('projectlesscalendarcount')
    } else {
      return 'no Projectless Calendar counter'
    }
  },
  contextlesscalendarcount: function () {
    if (Counts.has('contextlesscalendarcount')) {
      return Counts.get('contextlesscalendarcount')
    } else {
      return 'no Contextless Calendar counter'
    }
  },
  projectlesscontextlesscalendarcount: function () {
    if (Counts.has('projectlesscontextlesscalendarcount')) {
      return Counts.get('projectlesscontextlesscalendarcount')
    } else {
      return 'no Projectless/Contextless Calendar counter'
    }
  },
  contandprojcount: function () {
    return Counts.get('hasbothcontandprojcount')
  },
  contnotprojcount: function () {
    return Counts.get('hascontnotprojcount')
  },
  projnotcontcount: function () {
    return Counts.get('hasprojnotcontcount')
  },
  sum: function () {
    return Counts.get('inboxcount') + 
           Counts.get('projectlesscontextlesscalendarcount') +
           Counts.get('hasbothcontandprojcount') +
           Counts.get('hascontnotprojcount') +
           Counts.get('hasprojnotcontcount')
  },
})

Template.statistics.events({
})
