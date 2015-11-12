Template.energyfilter.helpers({
  calendarorinbox: function () {
    if (Session.equals("gtdmode", "reviewmode")) {
      return 'Inbox'
    } else if (Session.equals("gtdmode", "domode")) {
      return 'Calendar'
    }
  },
  zeroselected: function () {
    if (Session.equals("energylevel", "calendaronly")) {
      return 'btn-primary'
    }
  },
  oneselected: function () {
    if (Session.equals("energylevel", 1)) {
      return 'btn-primary'
    }
  },
  twoselected: function () {
    if (Session.equals("energylevel", 2)) {
      return 'btn-primary'
    }
  },
  threeselected: function () {
    if (Session.equals("energylevel", 3)) {
      return 'btn-primary'
    }
  },
  fourselected: function () {
    if (Session.equals("energylevel", 4)) {
      return 'btn-primary'
    }
  },
  fiveselected: function () {
    if (Session.equals("energylevel", 5)) {
      return 'btn-primary'
    }
  },
  sixselected: function () {
    if (Session.equals("energylevel", 6)) {
      return 'btn-primary'
    }
  },
  sevenselected: function () {
    if (Session.equals("energylevel", 7)) {
      return 'btn-primary'
    }
  },
})

//couldn't templatize the energymeter and the energyfilter into one thing because can't listen to events outside the template - if someone knows how feel free to send a pull request

Template.energyfilter.events({
  'click .energy0': function () {
    Session.set("energylevel", "calendaronly")
  },
  'click .energy1': function () {
    Session.set("energylevel", 1)
  },
  'click .energy2': function () {
    Session.set("energylevel", 2)
  },
  'click .energy3': function () {
    Session.set("energylevel", 3)
  },
  'click .energy4': function () {
    Session.set("energylevel", 4)
  },
  'click .energy5': function () {
    Session.set("energylevel", 5)
  },
  'click .energy6': function () {
    Session.set("energylevel", 6)
  },
  'click .energy7': function () {
    Session.set("energylevel", 7)
  },
})
