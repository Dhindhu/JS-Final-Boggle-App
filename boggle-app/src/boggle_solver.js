/**
 * Given a Boggle board and a dictionary, returns a list of available words in
 * the dictionary present inside of the Boggle board.
 * @param {string[][]} grid - The Boggle game board.
 * @param {string[]} dictionary - The list of available words.
 * @returns {string[]} solutions - Possible solutions to the Boggle board.
 * 
 * Code Review: Onyinyechi Ogbuanya
 */

 function TrieNode(character) {
  this.char = character;
  this.parent = null;
  this.children = {};
  this.correct = false;
}

// Returns the word corresponding to this node.
TrieNode.prototype.word = function() {
  var ans = [];
  var node = this;
  while (node !== null) {
    ans.push(node.char);
    node = node.parent;
  }
  ans.reverse();
  return ans.join('');
};

function trie(root, given) {
    let node = root;
    for (let i = 0; i < given.length; ++i) {
	let c = given[i];
  
	if (c === 'q' && given[i + 1] === 'u') {
	    c = 'qu';
	    i = i + 1;
	}
  if (c === 's' && given[i + 1] === 't') {
	    c = 'st';
	    i = i + 1;
	}
	if (node.children[c] === undefined) {
	    node.children[c] = new TrieNode(c);
	    node.children[c].parent = node;
	}
	 node = node.children[c];
  }
  node.correct = true;
}


function buggleSolver(dict, grid) {
    this.trieRoot = new TrieNode();
    for (let given of dict) {
	trie(this.trieRoot, given);
    }
    this.grid = grid;
    this.solutions = new Set();
}

buggleSolver.prototype.solve = function() {
  for (let row = 0; row < this.grid.length; ++row) {
    for (let col = 0; col < this.grid[0].length; ++col) {
      this.recursiveSolve(row, col, this.trieRoot);
    }
  }
};

buggleSolver.prototype.recursiveSolve = function(row, col, parentNode) {
  if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) return;
  const presentBlock = this.grid[row][col];
  const presentNode = parentNode.children[presentBlock];
  if (presentNode === undefined) return;  

  if (presentNode.correct) {
      if(presentNode.word().length >= 3) { 
          this.solutions.add(presentNode.word());
      }
  }
  this.grid[row][col] = '.';  

  for (let dx = -1; dx < 2; ++dx) {
    for (let dy = -1; dy < 2; ++dy) {
      this.recursiveSolve(row + dx, col + dy, presentNode);
    }
  }

  this.grid[row][col] = presentBlock;  
};

function findAllSolutions(grid, dict) {
  let solver = new buggleSolver(dict, grid);
  solver.solve();
  return [...solver.solutions];
}

export default findAllSolutions;
