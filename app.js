var gridFunctions = require('./functions');

var grid, input, solved;

var input = [         
  [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 6, 0, 0, 0, 0, 0],
  [0, 7, 0, 0, 9, 0, 2, 0, 0],
  [0, 5, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 4, 5, 7, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 3, 0],
  [0, 0, 1, 0, 0, 0, 0, 6, 8],
  [0, 0, 8, 5, 0, 0, 0, 1, 0],
  [0, 9, 0, 0, 0, 0, 4, 0, 0] 
];    

grid = gridFunctions.createGrid();
grid = gridFunctions.inputValues(grid, input, solved);

// console.log(gridFunctions.printGrid(grid, false));

grid = gridFunctions.solve(grid);

// console.log(gridFunctions.printGrid(grid, false));

// grid = gridFunctions.createGrid();
// grid = gridFunctions.inputValues(grid, solved);
// console.log('solved', gridFunctions.verifyGrid(grid));


