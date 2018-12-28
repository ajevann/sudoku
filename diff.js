module.exports = function(grid, prevGrid){

  var values = [].concat.apply([], grid).filter(s => s.value > 0).map(s => s.value);
  var prevValues = [].concat.apply([], prevGrid).filter(s => s.value > 0).map(s => s.value);

  console.log('... Values changed', values.length - prevValues.length);

};