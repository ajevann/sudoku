var _ = require('lodash');
var diff = require('./diff');

// main cleaner
module.exports = function(grid){
  var prevGrid = _.cloneDeep(grid);

  var i, j;
  for(i = 0; i < 9; i++){
    for(j = 0; j < 9; j++){
      grid = cleanupSquarePossiblities(grid, i, j);
    }
  }

  // cleanupDuplicatedDuosInSRC(grid);

  for(i = 0; i < 9; i++)
    cleanupSRCPossiblities(grid, 'row', i);
  
  for(i = 0; i < 9; i++)
    cleanupSRCPossiblities(grid, 'col', i);
  
  for(i = 0; i < 9; i++)
    cleanupSRCPossiblities(grid, 'subgrid', i);

  // diff(grid, prevGrid);

  return grid;
}

// general function to reduce the number of possible values and if possible set the actual value
function cleanupSquarePossiblities(grid, row, col){
  var square = grid[row][col];

  if( square.value == 0){

    var rowValues = getValues(grid, 'row', square.row).filter(item => item != 0);
    var colValues = getValues(grid, 'col', square.col).filter(item => item != 0);
    var subgridValues = getValues(grid, 'subgrid', square.subgrid).filter(item => item != 0);

    var possibleValues = square.possibleValues.filter(item => {
      return rowValues.indexOf(item) == -1 && colValues.indexOf(item) == -1 && subgridValues.indexOf(item) == -1;
    });

    square.possibleValues = possibleValues;

    if(square.possibleValues.length == 1){
      square.value = square.possibleValues[0];
    }

  } else {
    square.possibleValues = [];
  }

  grid[row][col] = square;

  return grid;
}

function cleanupDuplicatedDuosInSRC(grid){
  var gridArray = [].concat.apply([], grid);
  var subGridSquares, subGridPossibleValues, subGridPossibleValuesDuplicates;

  ['subgrid', 'row', 'col'].forEach(direction => {
    for(i = 0; i < 9; i++){

      subGridSquares = gridArray.filter(s => s[direction] == i && s.possibleValues.length);
      subGridPossibleValues = subGridSquares.map(s => s.possibleValues);
      subGridPossibleValuesDuplicates = subGridPossibleValues.filter(s => s.length == 2).duplicates();

      subGridSquares.forEach(s => {
        var newPV = [];

        subGridPossibleValuesDuplicates.forEach(d => {
          d.forEach(dd => {
            if(s.possibleValues.indexOf(dd) > -1){
              newPV = s.possibleValues.remove(dd);
            }
          });
        });

        if(newPV.length > 0)
          grid[s.row][s.col].possibleValues = newPV;
      });

    }
  });
}

function cleanupSRCPossiblities(grid, direction, subgridIndex) {
  var gridArray = [].concat.apply([], grid);
  var subGridSquares = gridArray.filter(s => s[direction] == subgridIndex && s.possibleValues.length);
  var subgridConcatenattedPossibleValues = subGridSquares.map(s => s.possibleValues);
  var groupedValues = [].concat.apply([], subgridConcatenattedPossibleValues).sort();
  var groupedValuesObj = countOccurences(groupedValues);

  subGridSquares.forEach(s => {
    s.possibleValues.forEach(v => {
      if( groupedValuesObj[v] == 1 && s.possibleValues.indexOf(v) > -1){
        s.value = v;
      }
    });
  });

  return grid;
}

function contains(arr1, arr2){
  if (arr1.length == arr2.length){
    arr1.forEach(v1 => {
      if(arr2.indexOf(v1) == -1)
        return false;
    });
  }

  return false
}

// For when there are only two inlined, empty squares in a subgrid, you can infer that no other squaure in the row/col has that value
function cleanupInlineTwofers(grid){
  var i;

  ['subgrid', 'row', 'col'].forEach(direction => {

    for(i = 0; i < 9; i++){

      // Get the squares for a give direction
      var squares = grid.flat().filter(s => s[direction] == i && s.value == 0) || [];
      
      // If there are only two values left in the direction
      if( squares.length == 2) {
  
        var possibleValuesToRemove = squares.map(s => s.possibleValues).flat().distinct() || [];
  
        ['subgrid', 'row', 'col'].forEach(subdirection => {

          var d = squares.map(s => s[subdirection]).distinct() || [];
          if (d.length == 1){
            var dSquares = grid.flat().filter(s => s[subdirection] ==  d[0] && s[direction] != i && s.possibleValues.length > 0) || [];

            dSquares.forEach(s => {
              possibleValuesToRemove.forEach(v => {
                grid[s.row][s.col].possibleValues = grid[s.row][s.col].possibleValues.remove(v);
              });
            });
          }

        });
  
      }
    }

  });

  return grid;
}

// returns the values for a given row/col/subgrid
function getValues(grid, target, index){
  var array = [].concat.apply([], grid);
  var target = array.filter(item => item[target] == index);
  var targetValues = target.map(item => item.value);

  return targetValues;
}

function countOccurences(arr, value) {
  var a = [], b = [], prev;

  arr.sort();
  for ( var i = 0; i < arr.length; i++ ) {
      if ( arr[i] !== prev ) {
          a.push(arr[i]);
          b.push(1);
      } else {
          b[b.length-1]++;
      }
      prev = arr[i];
  }

  var obj = {};

  a.forEach(function(v, index) {
    obj[v] = b[index];
  });

  if(value){
    return obj[value];
  }

  return obj;
}
