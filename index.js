let emptytilePosRow = 2;
let emptytilePosCol = 2;
let cellDisplacement = "69px";

function moveTile(){
   // Gets the position of the current element
   let pos = $(this).attr('data-pos');
   let posRow = parseInt(pos.split(',')[0]);
   let posCol = parseInt(pos.split(',')[1]);

   // Up
   if (posRow + 1 == emptytilePosRow && posCol == emptytilePosCol)
   {
     $(this).animate({
      'top' : "+=" + cellDisplacement //moves up
      });

      $('#empty').animate({
      'top' : "-=" + cellDisplacement //moves down
      });
   }
   // Down
   if (posRow - 1 == emptytilePosRow && posCol == emptytilePosCol)
   {
     $(this).animate({
      'top' : "-=" + cellDisplacement //moves Down
      });

      $('#empty').animate({
      'top' : "+=" + cellDisplacement //moves Up
      });
   }
   // Left
   if (posRow == emptytilePosRow && posCol + 1 == emptytilePosCol)
   {
     $(this).animate({
      'right' : "-=" + cellDisplacement //moves left
      });

      $('#empty').animate({
      'right' : "+=" + cellDisplacement //moves right
      });
   }
   // Right
   if (posRow == emptytilePosRow && posCol - 1 == emptytilePosCol)
   {
     $(this).animate({
      'right' : "+=" + cellDisplacement //moves right
      });

      $('#empty').animate({
      'right' : "-=" + cellDisplacement //moves left
      });
   }

  // Update empty position
  $('#empty').attr('data-pos', emptytilePosRow + "," + emptytilePosCol);
}

class Node {
    constructor(value, state, emptyRow, emptyCol, depth) {
      this.value = value;
      this.state = state;
      this.emptyCol = emptyCol;
      this.emptyRow = emptyRow;
      this.depth = depth;
      this.strRepresentation = "";
      this.path = "";

      // String representation of the state in CSV format
      for (var i = 0; i < state.length; i++)
      {
         // We assume the state is a square
         if (state[i].length != state.length) {
            alert('Number of rows differs from number of columns');
            return false;
         }

         for (var j = 0; j < state[i].length; j++)
           this.strRepresentation += state[i][j] + ",";
      }
      this.size = this.state.length;
    }

    clone() {
       return JSON.parse(JSON.stringify(this.state));
    }
}

class AStar {
  constructor(initial, goal, empty){
    this.initial = initial;
    this.goal = goal;
    this.empty = empty;
    this.queue = new PriorityQueue(
      {
        function(a, b) {
          if (a.value > b.value) {
            return 1;
          } else {
            return 0;
         }
       }
     }
    );
    this.queue._push(initial);
    this.visited = [];
    }

  execute() {
    // Add current state to visited list
    this.visited.push(this.initial.strRepresentation)
    let end = 0;
    while (this.queue.size() > 0)
    {
      var current = this.queue.pop();
      // console.log(
      //   current,
      //   current.strRepresentation,
      //   this.goal.strRepresentation,
      //   this.queue
      // );
      if (current.strRepresentation == this.goal.strRepresentation) {
        createPanel(current.state, "Winning scheme: " + current.path);
        return current;
      }
      this.expandNode(current);
      end++;
      if (end > 2000) {
        createPanel(current.state, "Winning scheme: Not Found");
        break;
      }
    }
  }

  expandNode(node)
  {
     let temp = '';
     let col = node.emptyCol;
     let row = node.emptyRow;
     let newState = undefined;
     let newNode = undefined;
     // Up
     if (row > 0)
     {
        newState = node.clone();
        temp = newState[row - 1][col];
        newState[row - 1][col] = this.empty
        newState[row][col] = temp
        createPanel(newState, node.path + "U");
        newNode = new Node(0, newState, row - 1, col,  node.depth + 1)

        if (!this.visited.includes(newNode.strRepresentation))
        {
          newNode.value = newNode.depth + this.heuristic(newNode)
          newNode.path = node.path + "U"
          this.queue._push(newNode)
          this.visited.push(newNode.strRepresentation)
        }
     }

     // Down
     if (row < node.size - 1)
     {
        newState = node.clone();
        temp = newState[row + 1][col]
        newState[row + 1][col] = this.empty
        newState[row][col] = temp
        createPanel(newState, node.path + "D");
        newNode = new Node(0, newState, row + 1, col, node.depth + 1)

        if (!this.visited.includes(newNode.strRepresentation))
        {
           newNode.value = newNode.depth + this.heuristic(newNode)
           newNode.path = node.path + "D"
           this.queue._push(newNode)
           this.visited.push(newNode.strRepresentation)
        }
     }

     // Left
     if (col > 0)
     {
         newState = node.clone();
         temp = newState[row][col - 1]
         newState[row][col - 1] = this.empty
         newState[row][col] = temp
         createPanel(newState, node.path + "L");
         newNode = new Node(0, newState, row, col - 1, node.depth + 1)

         if (!this.visited.includes(newNode.strRepresentation))
         {
           newNode.value = newNode.depth + this.heuristic(newNode)
           newNode.path = node.path + "L"
           this.queue._push(newNode)
           this.visited.push(newNode.strRepresentation)
         }
     }

     // Right
     if (col < node.size - 1)
     {
          newState = node.clone();
          temp = newState[row][col + 1]
          newState[row][col + 1] = this.empty
          newState[row][col] = temp
          createPanel(newState, node.path + "R");
          newNode = new Node(0, newState, row, col + 1, node.depth + 1)

          if (!this.visited.includes(newNode.strRepresentation))
          {
             newNode.value = newNode.depth + this.heuristic(newNode)
             newNode.path = node.path + "R"
             this.queue._push(newNode)
             this.visited.push(newNode.strRepresentation)
          }
      }
  }

  heuristic(node)
  {
     return this.manhattanDistance(node) + this.manhattanDistance(node);
  }

  // Returns number of misplaced tiles
  misplacedTiles(node)
  {
     var result = 0;

     for (var i = 0; i < node.state.length; i++)
     {
        for (var j = 0; j < node.state[i].length; j++)
          if (node.state[i][j] != this.goal.state[i][j] && node.state[i][j] != this.empty)
            result++;
     }

     return result;
  }

  manhattanDistance(node)
  {
     var result = 0;

     for (var i = 0; i < node.state.length; i++)
     {
        for (var j = 0; j < node.state[i].length; j++)
        {
           var elem = node.state[i][j]
           var found = false
           for (var h = 0; h < this.goal.state.length; h++)
           {
              for (var k = 0; k < this.goal.state[h].length; k++)
              {
                 if (this.goal.state[h][k] == elem)
                 {
                    result += Math.abs(h - i) + Math.abs(j - k)
                    found = true
                    break
                 }
              }
              if (found) break
           }
        }
     }
     result += this.misplacedTiles(node);
     result += this.linearConflicts(node);

     return result
  }

  linearConflicts (node)
  {
     var result = 0
     var state = node.state

     // Row Conflicts
     for (var i = 0; i < state.length; i++)
        result += this.findConflicts(state, i, 1)

     // Column Conflicts
     for (var i = 0; i < state[0].length; i++)
        result += this.findConflicts(state, i, 0)

     return result
  }

  findConflicts(state, i, dimension)
  {
     var result = 0;
     var tilesRelated = new Array();

     // Loop foreach pair of elements in the row/column
     for (var h = 0; (h < state.length - 1) && !tilesRelated.includes(h); h++)
     {
        for (var k = h + 1; (k < state.length) && !tilesRelated.includes(h); k++)
        {
           var moves = dimension == 1
              ? this.inConflict(i, state[i][h], state[i][k], h, k, dimension)
              : this.inConflict(i, state[h][i], state[k][i], h, k, dimension);

           if (moves == 0) continue;
           result += 2
           tilesRelated.push([h, k])
           break
        }
     }

     return result;
  }

  inConflict(index, a, b, indexA, indexB, dimension)
  {
     var indexGoalA = -1
     var indexGoalB = -1

     for (var c = 0; c < this.goal.state.length; c++)
     {
         if (dimension == 1 && this.goal.state[index][c] == a)
            indexGoalA = c;
         else if (dimension == 1 && this.goal.state[index][c] == b)
            indexGoalB = c;
         else if (dimension == 0 && this.goal.state[index][c] == a)
            indexGoalA = c;
         else if (dimension == 0 && this.goal.state[index][c] == b)
            indexGoalB = c;
     }

     return (indexGoalA >= 0 && indexGoalB >= 0) &&
            (
              (indexA < indexB && indexGoalA > indexGoalB) ||
              (indexA > indexB && indexGoalA < indexGoalB)
            )
            ? 2
            : 0;
   }
}

function createPanel(state, path)
{
  let output = '<h3>' + path + '</h3><div class="field">';
  state.forEach((row) => {
    output += '<div class="row">';
    row.forEach((col) => {
      output += '<div class="cell"><span>' + col + '</span></div>';
    });
    output += '</div>';
  });
  output += '</div>';
  document.getElementById('stepsInExecute').innerHTML = (output);
}
