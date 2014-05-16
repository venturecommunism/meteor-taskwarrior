//////////Generic Helper Functions///////////
//this function puts our cursor where it needs to be.
focusText = function (i,val) {
  i.focus();
  i.value = val ? val : "";
  i.select();
};
