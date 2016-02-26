/**
 * Data Object: stores all the game data in one key:value object
 * to cut down on global variables
 * */
Data = {
    player1turn: true,
    currentMark: "x",
    connectFour: false,
    boom : new Audio("audio/boomshaka.mp3"),
    downtown : new Audio("audio/downtown.mp3"),
    onfire : new Audio("audio/onfire.mp3"),
    dunk1 : new Audio("audio/dunk1.mp3"),
    dunkjam : new Audio("audio/dunkjam.mp3"),
    retire : new Audio("audio/dunkretire.mp3"),
    tobig : new Audio("audio/tobigtofast.mp3"),
    face : new Audio("audio/face.mp3"),
    shoes : new Audio("audio/shoes.mp3"),
    heckler : new Audio("audio/boo.mp3"),
    //TODO: add more team images, remember to update html start modal to add more teams
    homeTeam: ["Images/lakers.png","Images/clippers.png","Images/mavericks.svg"],
    awayTeam: ["Images/pacers.png","Images/heat.png", "Images/celtics.png"],
    //    the current Symbol used;
    currentSymbol : null,
    player1Symbol : null,
    player2Symbol : null,
    //    player1turn's mark;
    player1mark : "x",
    //    player2's mark;
    player2mark : "o",
    // first board set to null after board function is made;
    //var board = [["","",""],["","",""],["","",""]];
    gameBoard : [["x","","x"],["","",""],["","",""]],
    match : 3,
    drawCount: 0,
    boardFill : 0,
    player1score : 0,
    player2score : 0,
    currentBox: null,
    countdownClock : 0,
    shotClock: 0,
    notStarted : true,
    kobe : $("<img>",{
        src: "Images/kobedunk2.png",
        class: "dunk"
    }),
    kobe2 : $("<img>",{
        src: "Images/kobedunk.png",
        class: "dunk2"
    }),
    kobe3 : $("<img>",{
        src: "Images/blocker.png",
        class: "block"
    }),
    ball : $("<img>",{
        src: "Images/bball.png",
        id: "balldrop"
    }),
    ballmiss : $("<img>",{
        src: "Images/bball.png",
        id: "ballmiss"
    }),
    topBox: null,
    timerMode: false,
    currentShotValue: 2
}
/**
 * Global Variables
 * had to makes these global for scope conflicts
 * TODO: fix these conflicts and add them to Data object
 * */
var alert = [["Boomshakala!!!!",Data.boom],["From DOWNTOWN!!!", Data.downtown],["He's on fire!!", Data.onfire]];
var wiff =[["Airrrrballll!!!", Data.heckler],["A Big Miss!!", Data.heckler],["Wheres the focus at??", Data.heckler]];
var dunkalert = [["A SPECTACULAR DUNK!!!", Data.dunk1],["JAMS IT IN!!!!!!", Data.dunkjam],["Consider retiring after being Dunked on like that", Data.retire]];
var dunkblock = [["ouch to the face", Data.face],["To Big to Fast to get by", Data.tobig],["Maybe its the shoes", Data.shoes]];
// click the box function
function clicked(targ) {

//        splits id into row and column according to array position
    //    calls the function checkClicked to see if a box was already clicked
    if (!$(targ).html()) {
        Data.currentBox = targ;
        openShotSelect();
        // return true if there is already text in the box
    }
    else {
        console.log("filled");
        return;
    }
}
/**
 * function: openShotSelect - Toggles the shotselectModal:
  TODO: fancy up the shotSelect modal
 * */
function openShotSelect(){
    modalActive("shotPickModal");
}
/**
 * function: createShotAttempt - called from 3 and 2point button event handler
 * params: difficulty - css class "fastaim", "slowaim" makes the animation slower or faster;
 TODO: add more difficulty animations css classes
 * does: opens the shot modal resets the modal html and appends a new shot game
 * */
function createShotAttempt(difficulty){
    //toggles the modal
    modalActive("shotmodal");
    //clears out classes
    $("#playingBall").removeClass("tooShort swish");
    $("#net").removeClass("rimshake");
    $("#shot").show();
    $(".modal-footer").html("");
    //create and append new shot game divs
    var shotTarget = $('<div>',{
        class: "target backboard"
    });
    var shotAimer = $('<div>',{
        class: "aimer " + difficulty
    });
    var shotbox = $('<div>',{
        class: "aimback",
    });
    shotbox.append(shotTarget, shotAimer);
    shotbox.appendTo(".modal-footer");
    //create random number and apply to the target
    var random = Math.floor(Math.random()* 400);
    $(".target").css("left", random + "px");
}
/**
 * function: shotMade - triggered when shot button is clicked
 * params: hit - integer (the left position of the moving aimer when the button is clicked)
 TODO: make another range to play a to far animation
 TODO: also this may need to be fixed in accuracy
 does: checks the range of hit to where the targets left position is and rewards or punishes player
 * */
function shotMade(hit){
    //hide the shot button after clicked
    $("#shot").hide();
    //get the targets position and find the accuracy
    var target = $(".target").offset();
    var accuracy = Math.abs(hit - target.left);

    //console.log("target: " + target.left, "player: " + hit, "accuracy: " + accuracy);

    if(accuracy < 50){
        randomAnnouncerDisplay(alert);
        $("#playingBall").addClass("swish" , "success");
        $("#net").addClass("rimshake");
        setTimeout(function(){
            shotSuccess(Data.currentBox);
            modalActive("shotmodal");
            return;
        }, 1500)
    }
    else{
        randomAnnouncerDisplay(wiff, "warn");
        $("#playingBall").addClass("tooShort");
        setTimeout(function(){
            shotMiss(Data.currentBox);
            modalActive("shotmodal");
            return;
        }, 1500)
    }
}
/**
 * function: dunkAttempt - triggered when dunk is selected
 * params: num - integer dunk power and  points - point difference
 TODO: make dunks more fair?
 * */
function dunkAttempt(num, c){
    var r = Math.floor(Math.random()* 20) - c;
    console.log(r + "rand:counter" + c + " power: " + num);
    r < num ? dunked() : dunkedMiss();
    modalActive("shotPickModal");
}
/**
 * function: dunked - triggered when dunk is successful
 * params: none,  uses current box to find column and obliterates it in dunkAnimation
 * */
function dunked(){

    var id = $(Data.currentBox).attr("id");
    var col = parseInt(id[1]);
    dunkAnimation(col);
    randomAnnouncerDisplay(dunkalert, "success");
    if(Data.player1turn){
        Data.player1score += Data.currentShotValue;
        $(".home .value").text(Data.player1score);

    }
    else{
        Data.player2score += Data.currentShotValue;
        $(".away .value").text(Data.player2score);
    }

    updateDisplay();
    togglePlayerSymbols();
}
/**
 * function: dunkMiss - triggered when dunk is fails
 * params: none,  uses current box to find column and perform a dunkAnimationMiss on it
 * */
function dunkedMiss(){

    var id = $(Data.currentBox).attr("id");
    var col = parseInt(id[1]);

    dunkAnimationMiss(col);

    randomAnnouncerDisplay(dunkblock, "warn");

    updateDisplay();
    togglePlayerSymbols();
}
/**
 * function: shotSuccess - triggered when shot is made
 * params: targ - element
 * does: gets the id and checks if connect 4 mode is on and makes col drop to bottom
 *  applies the symbol on board and animates it and adds the shot value to the score
 *  checks to see if won
 * */
function shotSuccess(targ){
    //get row and col info from element id
    Data.drawCount++;
    var id = $(targ).attr("id");
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);
//  if connect Four increment down to last unused row
    if(Data.connectFour) {
        while (row < Data.gameBoard.length - 1 && Data.gameBoard[row + 1][col] === "") {
            ++row;
        }
    }
//  set the game board to current players mark value inside row and column numbers provided;
    Data.gameBoard[row][col] = Data.currentMark;
    //create and append an image to game board with current Player Symbol
    var img = $("<img>",
        {
            src: Data.currentSymbol
        })
    $("#0" + col).append(Data.ball);

   // $("#0" + col).remove(Data.ball);
    //remove the drop animation;
    setTimeout(function(){

        $("#" + row + col).append(img);
        $(Data.ball).remove();
    },1300)

    if(Data.player1turn){
        Data.player1score += Data.currentShotValue;
        $(".home .value").text(Data.player1score);
        $("#homemeter").get(0).value+= powerCheck(Data.player1score, Data.player2score);
    }
    else{
        Data.player2score += Data.currentShotValue;
        $(".away .value").text(Data.player2score);
        $("#awaymeter").get(0).value+= powerCheck(Data.player2score, Data.player1score);
    }

    updateDisplay();
    if (checkWin(Data.gameBoard, row, col, Data.match)) {
        clearInterval(Data.countdownClock);
        if(Data.player1turn){
            Data.player1score = Data.player2score + 1;
            winAnimation("home");
        }
        else {
            Data.player2score = Data.player1score + 1;
            winAnimation("away");
        }
    }

//        switch the symbols for player turn;
    togglePlayerSymbols();
}
/**
 * function: powerCheck - checks how much dunk power to give a player
 * params: 2 integers, compares them and returns a number back based on fairness
 * */
function powerCheck(num1, num2){
    var boost = 0;
    if (!Data.connectFour) boost = 5;
    var dif = num1 - num2;

    if(dif > 5){
        return .5;
    }
    else if(dif < -5){
        return 4  + boost;
    }
    else if(dif < -20){
        return 20;
    }
    else {
        return 1 + boost;
    }
}
/**
 * function: shotMiss - when player misses the shot game
 * params: targ - element id, plays miss animation and toggles turn
 * */
function shotMiss(targ){
    //get row and col info from element id
    var id = $(targ).attr("id");
    var col = parseInt(id[1]);
    $("#0" + col).append(Data.ballmiss);

    // $("#0" + col).remove(Data.ball);
    //remove the drop animation;
    setTimeout(function(){
        $(Data.ballmiss).remove();
    },1100)

//        switch the symbols for player turn;
    togglePlayerSymbols();
}
/**
 * function: togglePlayerSymbols - toggles the turn and sets current Symbols/mark to the other players
 * params: none
 * */
function togglePlayerSymbols(){
    if((Data.gameBoard.length * Data.gameBoard.length) == Data.drawCount){
        winAnimation("draw");
    }
//        if player 1 turn
    if(Data.player1turn){
//            set current mark and symbol to player2 and toggle player boolean
        Data.currentMark = Data.player2mark;
        Data.currentSymbol = Data.player2Symbol;
        Data.player1turn = false;
    }
//        must be players 2 turn
    else{
//            switch back current mark/symbol to player 1 and toggle player boolean;
        Data.currentMark = Data.player1mark;
        Data.currentSymbol = Data.player1Symbol;
        Data.player1turn = true;
    }
    updateDisplay();
}








