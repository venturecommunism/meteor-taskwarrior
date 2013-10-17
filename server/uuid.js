var uuid = Meteor.require('uuid')

Meteor.methods({
  uuid: function () {
    var uuidval = uuid.v4()
    return uuidval
  }
})
