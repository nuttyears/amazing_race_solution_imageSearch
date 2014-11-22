var player1Position = 0;
var player2Position = 0;
var player1Color;
var player2Color;
var player1Name;
var player1SearchTerm;
var player2Name;
var player2SearchTerm;
var startTime;

// It was quite useful to have a function I could just call to always update the squares correctly.
function updateSquares() {
  $(".player-1").css('margin-left', (player1Position * 15) + 'px');
  $(".player-2").css('margin-left', (player2Position * 15) + 'px');
}

/*
   I use a boolean here to prevent winners from overriding each other.
   Just initialize it to false, then set to true when someone wins.
   Make the function return early if someone's already one.

   You could also do this by just checking if the h1 had any text inside of it, yet, like:
   $("h1").text() == ""
*/
var winnerAnnounced = false;
function checkForWinner() {
  if(winnerAnnounced) { return null; }

  if(player1Position >= 40 || player2Position >= 40) {
    // Once winnerAnnounced is true, this function (checkForWinner) will always return immediately (2 lines up).
    winnerAnnounced = true;

    // Get a new timestamp, calculate total time
    var endTime = new Date();
    var totalMilliseconds = endTime - startTime;

    /*
      Set the h1

      These if-statements below are *kind of* a shorthand.
      The story is, you don't actually need {}s, if you only have 1 statement in the block.
      (like "winner = player1Name;"
      But it's a risky thing to do, so I always put it on the same line.
    */

    var winner;
    if(player1Position >= 40) winner = player1Name; 
    if(player2Position >= 40) winner = player2Name; 
    $("h1").text(winner + " won in " + (totalMilliseconds / 1000) + " seconds!");
  }
}

function buildFlickrUrl(p) {
  var url = "https://farm"+p.farm+".staticflickr.com/"+p.server+"/"+p.id+"_"+p.secret+".jpg";
  return url;
}

$(document).ready(function() {

    $(".player-1-search-button").click(function() {
        player1SearchTerm = $(".player-1-search-input").val();
        console.log("button");

        $.get("https://www.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=4ef070a1a5e8d5fd19faf868213c8bd0&nojsoncallback=1&text="+player1SearchTerm, function(response) { 
          console.log("get");
          for (var i = 0; i < 3; i++) { 
            var photoUrl = buildFlickrUrl(response.photos.photo[i]);
            $("img").eq(i).attr('src',photoUrl);
            $("input.player-1-avatar").eq(i).attr('value',photoUrl);
           //console.log(photoUrl);
          }
          
        });
    })




  

  $("form").submit(function() {
    player1Name = $(".player-1-name-input").val() || "Player 1"; // Again, use a default name.
    $(".player-1-name").text(player1Name);

    var url = $(".player-1-avatar:checked").val();
    $(".player-1").attr('src',url);

    player2Name = $(".player-2-name-input").val() || "Player 2"; // Again, use a default name.
    $(".player-2-name").text(player2Name);

    var url = $(".player-2-avatar:checked").val();
    $(".player-2").attr('src',url);

    // Now, hide the setup screen and show the board!
    $(".setup-screen").hide();
    $(".board").show();

    // Funny bug: while typing in player names, I was moving the players across the screen! 
    // Easiest fix is to just reset the positions here
    player1Position = 0;
    player2Position = 0;
    updateSquares();

    // Start the timer
    startTime = new Date();

    return false; // Make sure the form doesn't submit
  });

  $(document).keydown(function (event) {
    var keycode = event.which;
    if(keycode == 65) {
      player1Position++;
    } else if(keycode == 76) {
      player2Position++;
    }

    updateSquares();
    checkForWinner();

  });
});
