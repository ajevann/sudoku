module.exports = function(grid, options){
  var i, j, output = '';

  options = options || {
    value: true,
    possibilities: true,
    subgrid: false,
    col: false,
    row: false
  };

  if(grid.length == 0){
    return;
  }

  for(i = 0; i < 9; i++){
    output += '| ';

    for(j = 0; j < 9; j++){

      if(grid[i][j].value == 0){
        if(options.possibilities &&  grid[i][j].possibleValues.length){
          output += '(' + grid[i][j].possibleValues + ')';
        } else {
          output += ' ';
        }
      } else {
        output += grid[i][j].value;
      }

      if(options.subgrid){
        output += '[' + grid[i][j].subgrid + ']';
      }
      
      if(options.row){
        output += '[' + grid[i][j].row + ']';
      }
      
      if(options.col){
        output += '[' + grid[i][j].col + ']';
      }

      output += ' | ';
    }

    // console.log(output);
    output += '\n';
  }

  // console.log(output);
  return output;
}