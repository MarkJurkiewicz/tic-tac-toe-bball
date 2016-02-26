
/**
 Function: Check win:
 Check Win works by comparing the starting value(x or o) in a nested array with the value of each cell next to it
 using 8 while loops that count matches traveling horizontal, vertical, and diagonal  until
 it hits something, goes out of bounds or reaches the number of matches needed to win.
 Params: board - a nested array, r - integer row number, c - integer column number, match - integer number to return true
 returns: only true or false if enough matches found;
* */

function checkWin(board, r, c, match){
    //turns the starting column and row coordinates into Integers
    var col = parseInt(c);
    var row = parseInt(r);
    //gets the value in the array (x or o);
    var marker =  board[row][col];
    //initialize points to compare with matches needed
    var points = 0;
    //create a stack of search direction through the array
    //row up/ row down/column up/column down/diagonal left to right down/ up /diagonal right to left down/ up
    var callstack = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[-1,1],[1,-1]];
    //loop that calls each search as needed
    for(var i = 0 ; i < 8; i += 2){
        //reset points to one after each search is performed
        points = 1;
        //calls a search in one direction
        points = searchMatches(points, row, col,callstack[i][0], callstack[i][1]);
        if( matchCheck()) return true;
        //call a search in opposite direction
        points = searchMatches(points, row, col, callstack[i+1][0], callstack[i+1][1]);
        if( matchCheck()) return true;
    }
    //check if enough matches have been found and aborts search
    function matchCheck(){
        return (points == match);
    }
    //params: points integer, starting row and column integers, 2 direction integers for row and column
    function searchMatches( numpoint, numrow, numcol, direction, direction2){
        while(true) {
            //searches through array depending on the direction increment given [0 no moves, 1 moves forward, -1 moves backward]
            numrow += direction;
            numcol += direction2;
            //return if enough matches found;
            if(numpoint == match){
                break;
            }
            //make sure its still in array boundary;
            else if(numrow > board.length - 1 || numrow < 0 || numcol > board.length - 1 || numcol < 0){
                break;
            }
            //check if no match found
            else if( marker != board[numrow][numcol]){
                break;
            }
            //check if match found could be default else
            else if (marker == board[numrow][numcol]){
                numpoint++;
            }
        }
        //return points after loop is done
        return numpoint;
    }
    //nothing found return false
    return false;
}

