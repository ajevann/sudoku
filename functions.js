var verifyGrid = require('./verifyGrid');
var printGrid = require('./printGrid');
var _ = require('lodash');

var diff = require('./diff');
var cleanupGridPossibilities = require('./cleanup');

function createGrid(){
  var i = 0, j = 0, k = 0, id = 0, grid = [];

  for(i = 0; i < 9; i++){
    grid[i] = [];

    if (i % 3 == 0)
      k = i;

    for(j = 0; j < 9; j++){

      if (j % 3 == 0)
        k++;

      grid[i].push({ 
        id : id++,
        row : i,
        col : j,
        subgrid : k,
        value : 0,
        possibleValues : [1, 2, 3, 4, 5, 6, 7, 8, 9],
        possibleValueOccurrences : {},
        _trueValue: -1
      });
    } 

    k = k - 3;
  }

  return grid;
}

function inputValues(grid, input, solved){
  var i, j;

  for(i = 0; i < 9; i++){
    for(j = 0; j < 9; j++){
      grid[i][j].value = input[i][j];
      grid[i][j]._trueValue = solved && solved.length ? solved[i][j] : 0;
    }
  }
  
  return grid;
}

var options = {
  value: true,
  possibilities: false,
  subgrid: false,
  col: false,
  row: false
};

var iteration = 0, bruteforce = true, bruteforceIndex = 0;

function solve(grid){
  var prevGridHash = toString(grid);

  console.log('\n----------------------------------------\n');
  console.log('Iteration #', iteration++);
  console.log(printGrid(grid, options));

  // console.log(verifyGridAgainstTrueValues(grid) ? '... Correct values so far' : '... Incorrect value found');

  if(readyToVerify(grid)){
    console.log('... Ready to verify')
    
    if(verifyGrid(grid)){
      
      console.log('... Solved!');
      return grid;

    } else {
      
      grid = cleanupGridPossibilities(grid);

    }
  } else {

    console.log('... Cleaning up grid possibilities');
    grid = cleanupGridPossibilities(grid);

  }

  var currGridHash = toString(grid);

  if (prevGridHash != currGridHash){
    
    console.log('... Hashes changed, try solving again');
    return solve(grid);

  } else {
    
    console.log('... Stuck')

    if(fullStop){
      console.log('... Full stop requested');
    } else {
      return solve(guessAndCheck(grid));
    }
  }
}

var mostValidGrid = null, guessAndCheckIndex = 0, squarePossibilities = [], fullStop = false;
function guessAndCheck(grid){

  if(mostValidGrid == null){
    mostValidGrid = JSON.stringify(grid);
    squarePossibilities = _.cloneDeep( ([].concat.apply([], grid)).filter(s => s.possibleValues.length > 0) );

    guesses = [];
    squarePossibilities.forEach(s => {
      s.possibleValues.forEach(pv => {
        guesses.push({
          row : s.row,
          col : s.col,
          subgrid : s.subgrid,
          guess : pv
        })
      })
    });

    guessAndCheckIndex = 0;

    console.log('... First guess and check run');
    console.log(JSON.stringify(guesses));
  } else {
    grid = JSON.parse(mostValidGrid);
    guessAndCheckIndex++;

    console.log('... Guess and check run', guessAndCheckIndex);
  }

  if(guesses){
    var s = guesses[guessAndCheckIndex];

    if(s){
      grid[s.row][s.col].value = s.guess;

      console.log('... Guess value set', '(' + s.row + ',' + s.col + '/' + s.subgrid + ')', grid[s.row][s.col].value);  
    } else {
      console.log('... PROBLEM');
      fullStop = true;
    }
  }

  return grid;
}

function readyToVerify(grid){
  var array = [].concat.apply([], grid);
  return array.filter(item => item.value == 0).length == 0; 
}

Array.prototype.flat = function(){
  return [].concat.apply([], this);
}

Array.prototype.distinct = function(){
  var d = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  return this.filter(d);
}

Array.prototype.remove = function(value){
  return this.filter(function(ele){
    return ele != value;
  }); 
}

Array.prototype.clone = function(){
  return this.slice(0);
}

Array.prototype.duplicates = function(){
  var tempArr = [], duplicates = [], rep;

  this.forEach(v => {
    rep = v.join('') || v;
    tempArr.indexOf(rep) == -1 ? tempArr.push(rep) : duplicates.push(v);
  });

  return duplicates;
}

Array.prototype.randomItem = function(){
  var i = Math.floor(Math.random() * Math.floor(this.length));
  return this[i];
}

function toString(grid){
  return JSON.stringify(grid);
}

function verifyGridAgainstTrueValues(grid){
  var i, j, verified = true;

  for(i = 0; i < 9; i++){
    for(j = 0; j < 9; j++){
      if(grid[i][j].value > 0 && grid[i][j].value != grid[i][j]._trueValue && grid[i][j]._trueValue != 0){
        // console.log('(' + i + ',' + j + ')', grid[i][j].value, grid[i][j]._trueValue);
        verified = false;
      }
    }
  }
  
  return verified;
}

module.exports = {
  solve: solve,
  printGrid: printGrid,
  createGrid: createGrid,
  inputValues: inputValues
}
