module.exports = function(grid){
  var i, j, k, sum = 0;

  for(i = 0; i < 9; i++, sum = 0){
    for(j = 0; j < 9; j++){
      sum += grid[i][j].value;
    }
    if (sum != 45){
      return false;
    }
  }

  for(j = 0; j < 9; j++, sum = 0){
    for(i = 0; i < 9; i++){
      sum += grid[i][j].value;
    }
    if (sum != 45){
      return false;
    }
  }

  var sortedGrid = sortBySubgrid(grid);

  for(i = 0; i < 9; i++, sum = 0){
    k = i * 9;
    
    var subgrid = sortedGrid.slice(k, k + 9); 
    var values = subgrid.map(item => item.value);

    for(j = 0; j < 9; j++){
      sum += values[j];
    }
    
    if (sum != 45){
      return false;
    }
  }

  if (grid[0][0]._trueValue > 0){
    return verifyGridAgainstTrueValues(grid);
  }

  return true;
}

function sortBySubgrid(grid){
  var array = [].concat.apply([], grid);

  array = array.sort(function (a, b) {
    return a.subgrid - b.subgrid;
  });

  return array;
}

function verifyGridAgainstTrueValues(grid){
  var i, j;

  for(i = 0; i < 9; i++){
    for(j = 0; j < 9; j++){
      if(grid[i][j].value > 0 && grid[i][j].value != grid[i][j]._trueValue){
        return false;
      }
    }
  }
  
  return true;
}