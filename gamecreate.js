/**
 * Document Ready: creates button event handlers
 *
 * */
$(document).ready(function(){
//        A button to Start the Game
    $("#start").click(function(){
        removeWinAnimation();
        modalActive("startModal");
    });
    // board button delegates when boxes are clicked
    $(".board").on("click",".box",function(){
        clicked(this);
    });
    //shot button
    $("#shot").click(function(){
        var num = $('.aimer').offset();
        shotMade(num.left);
        modalActive("shotPickModal");
    });
// 3 point shot select
    $("#3point").click(function(){
        createShotAttempt("fastaim")
        Data.currentShotValue = 3;
    });
    //2 point shot select
    $("#2point").click(function(){
        createShotAttempt("slowaim");
        Data.currentShotValue = 2;
    });
    //dunk select button
    $("#dunk").click(function(){
        Data.currentShotValue = 2;
        if(Data.player1turn){
            dunkAttempt($("#homemeter").val(), Data.player2score - Data.player1score);
            $("#homemeter").val(0);
        }
        else{
            dunkAttempt($("#awaymeter").val(), Data.player1score - Data.player2score);
            $("#awaymeter").val(0);
        }
    });
    //resets game button, reset variables, assigns team logos and starts game
    $("#startgame").click(function(){
        //assigns symbol based on drop down menu value
        Data.player1Symbol = Data.homeTeam[$('#team1').val()];
        console.log(Data.player1Symbol);
        Data.player2Symbol = Data.awayTeam[$('#team2').val()];
        //assigns size from dropdown menu
        var size = $('#gamesize').val();
        //puts up home and away team logos
        $(".home img").attr("src", Data.player1Symbol);
        $(".away img").attr("src", Data.player2Symbol);
        //closes start modal and resets scores
        modalActive("startModal");
        Data.player1score = 0;
        Data.player2score = 0;
        Data.drawCount = 0;
        $("#homemeter").val(0);
        $("#awaymeter").val(0);
        updateDisplay();
        //checks if size greater than 6 and assigns matches needed
        Data.match = size > 6 ? 4 : 3;
        //if match > 3 enable connect 4 mode
        Data.connectFour = (Data.match > 3);
        //start game with board size
        var m = $("#homemeter").val();
        startGame(size);
    })
});
/**
 * function: startGame - creates game board and click events to boxes
 * params: num - string("home" or "away") of winner
 * */
function startGame(num){
//  creates the number of div boxes in html
    createBoxes(num);
    //creates empty board array
    Data.gameBoard = createBoardArray(num);
//passes a click handler to each box class to activate the game logic

    //check if game has started
    if(Data.notStarted){
        //flag start and start countdown to 2 min
        var duration = $("#gametime").val();

        Data.notStarted = false;
        //takes variable storage, duration, display element, ending function
        if(duration > 0){
            countdown("countdownClock", duration, ".timer .value", function(){
                //when timer ends call winAnimation;
                if(Data.player1score > Data.player2score){
                    winAnimation("home");
                }
                else if(Data.player1score < Data.player2score){
                    winAnimation("away");
                }
                else{
                    winAnimation("draw");
                }
            });
        }
        else $(".timer .value").text("unlimited");
    }
}
/**
 * function: startGame - creates game board and click events to boxes
 * params: holder: var to store Interval, duration: integer, display: element id, callback function
 * */
function countdown(holder, duration, display, callback){
    var minutes, seconds;
    //use pointer to assign interval variable;
    Data[holder] = setInterval(function () {
        //divide time left by 60 to get min and seconds
        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);
        //adds a zero if less then 10 for uniform display
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        //display text to the target element
        $(display).text(minutes + ":" + seconds);
        //check if less than 10 seconds and apply glowing class
        if (--duration < 10) {
            $(display).addClass("current_team");
            if(duration <  0){
                //activate callback and clear interval when reaches 0
                callback();
                clearInterval(Data[holder]);
            }
        }
    }, 1000);
}
/**
* function: createBoxes
 * params: num - creates html divs with corresponding ids to col and row depending on size of board needed
* */
function createBoxes(num){
//        creates the boxes in html depending on number
    var size = (parseInt(100/num) -.4) + "%";

    for(var row = 0; row < num; row++){
        for(var col = 0; col < num; col++){
//                creates a box element with an id equal to its row and column in the board array;
            var box = $("<div>",{
                class: "box",
                id: row + "" + col
            });
            //add backboard to top row
            if(row == 0){
                $(box).addClass("backboard backboardBox");
            }
            //check box dimensions
            box.css({"width":size,"height":size});
            $(box).appendTo(".board");
        }
    }
}
/**
 * function: create Boardarray
 * params: number - creates a nested board array depending on size of board needed
 * */
function createBoardArray(number){
    var gameArray = [];
    for (var row = 0; row < number; row++) {
        var rowArray = [];
        for(var col = 0; col < number; col++) {
            rowArray.push("");
        }
        gameArray.push(rowArray);
    }
    return gameArray;
}

