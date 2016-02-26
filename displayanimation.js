

/**
 * Function: Toggles a modal depending on id given
 * params: mode - string (id number);
* */
function modalActive(mode){
    var modal = $("#" + mode);
    $(modal).toggle();
}
//uses announcerDisplay and an array to display random phrases and sounds
function randomAnnouncerDisplay(com, type){
    var r = Math.floor(Math.random()* com[1].length);
    announcerDisplay(com[r][0], type, com[r][1]);
}

/**
 *Function: announcerDisplay plays green text and displays warning
 * params: text(string any text message) type (string "warn" or "success"), sound(a sound object, taken from a variable)
 * */
//uses the alert element to display information
//params: text to display, string("warn", success"), sound object
function announcerDisplay(text, type, sound){
    var message = null;
    if(type == "warn"){
        // pointing to a jquery selector in a variable message previously declared
        message = $("#alert");
        message.removeClass("success"); //toggling classes
        message.addClass("warning");
    }
    else{
        // pointing to a jquery selector in variable message previously declared
        message = $("#alert");
        message.removeClass("warning");
        message.addClass("success");
    }
    if(sound){
        sound.play(); // variable sound calls on play audio function
    }
    $("#alert h1").text(text);  //displays commentator message
}
// updates the score stats on the title and lights up current team
/**
 * function: updateDisplay
 * params: none - toggles current team class and current symbol
* */
function updateDisplay(){
    if(Data.player1turn){
        $(".home").addClass("current_team");
        $(".away").removeClass("current_team");
        Data.currentSymbol = Data.player1Symbol;
    }
    else{
        $(".away").addClass("current_team");
        $(".home").removeClass("current_team");
        Data.currentSymbol = Data.player2Symbol;
    }

    $(".home .value").text(Data.player1score);
    $(".away .value").text(Data.player2score);
}

/**
* function: dunkAnimation - kobe dunking animation
 * params: column - integer of column to animate on
* */
function dunkAnimation(column){
    var id = $("#0" + column);
    var off = id.offset();
    // a chain of timeout and appends the kobe images stored in a jquery holder
    // uses css animation keyframes
    id.append(Data.kobe);
    setTimeout(function(){
        $(Data.kobe).remove();
        id.append(Data.kobe2, Data.ball);
        setTimeout(function(){
            //loop through columns and destory symbols and make explosions
            for(var i = 0; i < Data.gameBoard.length; i++){
                $("#" + (i) + column).addClass("explode");
                $("#" + (i) + column).empty();
                Data.gameBoard[i][column] = "";
            }
            $(Data.kobe2).remove();
            setTimeout(function(){
                $(Data.ball).remove();
                //destroyRow(column);
                setTimeout(function(){
                //remove explosions;
                for(var i = 0; i < Data.gameBoard.length; i++){
                    $("#" + (i) + column).removeClass("explode");
                }
                },1000);
            },800);
        },500);
    },2000);
}
/**
 * function: dunkAnimationMiss - kobe missing his dunking animation
 * params: column - integer of column to animate on
 * */
function dunkAnimationMiss(column){
    var id = $("#0" + column);
    // a chain of timeout and appends the kobe images stored in a jquery holder
    // uses css animation keyframes
    id.append(Data.kobe, Data.kobe3);
    setTimeout(function(){
        $(Data.kobe).remove();

        id.append(Data.kobe2, Data.ballmiss);
        setTimeout(function(){
            $(Data.kobe2).remove();
            setTimeout(function(){
                $(Data.kobe3).remove();
                $(Data.ballmiss).remove();
            },800);
        },500);
    },2000);
}
/**
 * function: winAnimation - victory animation
 * params: player - string("home" or "away") of winner
 * TODO: make a css class to display winning team more , also make a draw ending
 * */
function winAnimation(player){ // displays which player wins and displays crowd imgs and audio
    //animates images
    $(".board").empty();
    var symbol = $("<div>",
        {
            class: "winner",
            html: "<image src='" + Data.currentSymbol + "'>"
        });

    $(".board").append(symbol);
    if(player == "home"){

        $(".winner").text("HOME TEAM WINS!!!");
    }
    else if(player == "away"){
        $(".winner").text("AWAY TEAM WINS!!!");
    }
    else{
        $(".winner").text("ITS A DRAW BORING");
        return;
    }
    $("#alert").slideUp("slow"); // jquery method which animates the hide
    $("#crowd").html("<audio autoplay loop><source src='audio/readyforthis.mp3' type='audio/mpeg'></audio>"); //used jquery to append html to the crowd

    setTimeout(function(){
        var img = $('<div>',{
            class: "fade",
            html: "<image id='backc' src='Images/crowd2.png'><image id='frontc' src='Images/crowd1.png'>"
        });
        var img2 = $('<div>',{
            html: "<image id='backc' src='Images/crowd2.png'><image id='frontc' src='Images/crowd1.png'>"
        });
        $("#crowd").append(img);
        $("#crowd2").append(img2);
        $(".board").css("height", "67vh");
        $(".board").addClass("lights");
    }, 2000)
}
/**
 * function: removeWinAnimation - removes the crowd from the floor
 * params: none- called when game is reset
 * */
function removeWinAnimation() { //removes the winning display
    $("#crowd").empty();  //jquery method .empty removes all child elements from the selectors
    $("#crowd2").empty();
    $(".board").empty();
    $(".board").removeClass("lights").removeAttr("height");
    $(".message h1").html('');

    clearInterval(Data.countdownClock);//calls clearInterval function with parameter countdownClock
    Data.notStarted = true;
    $("#alert").show();
}