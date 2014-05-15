now = moment()
var formattednow = now.format('YYYYMMDD') + 'T' + now.format('HHmmss') + 'Z'
console.log('formatted is ' + formattednow)

Template.do.is_doing = function () {
  return Session.get('do_status')
}

Template.do.tasks = function () {
console.log(Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}], waiting: { $lt: formattednow}}, {sort: {due: -1}}) + "this is some text")
    return Taskspending.find({status: {$in: ["waiting", "pending"]}, $and: [{tags: {$not: "inbox"}}, {tags: "mit"}], waiting: { $lt: formattednow}}, {sort: {due: -1}})
}
