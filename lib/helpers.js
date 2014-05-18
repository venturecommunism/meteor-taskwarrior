//////////Generic Helper Functions///////////
//this function puts our cursor where it needs to be.
focusText = function (i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();
};

selectTaskProcessing = function(e,t) {
  Session.set('current_processedtask',this._id);
  Session.set('processing_task',true);
  Meteor.flush()
  focusText(t.find(".modal .title"));
};

removeItem = function(list_id,item_name) {
  if (!item_name&&!list_id)
    return;
  Taskspending.remove({_id:list_id});
};

updateProject = function(list_id,item_name,project_name) {
  var l = lists.findOne({"_id":list_id,"items.Name":item_name});
  if (l&&l.items){
    for (var i = 0; i<l.items.length; i++){
      if (l.items[i].Name === item_name){
          l.items[i].LentTo = project_name;
      }
    }
    lists.update({"_id":list_id},{$set:{"items":l.items}});
  }
};

