// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCWdZa4wBqMJtJYQBeZqmqq-NLnMOYdfZY",
    authDomain: "rps-multiplayer-7b42e.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-7b42e.firebaseio.com",
    projectId: "rps-multiplayer-7b42e",
    storageBucket: "",
    messagingSenderId: "198421649806"
  };
  firebase.initializeApp(config);

// variables
var database = firebase.database();


window.onload = function(){
	var playerInput = $("<form></form>");
	var nameInputBox = $("<input type = 'text' class = 'nameInputBox' placeholder = 'Name'></input>");
	var newPlayerBtn = $("<button class = 'newPlayerBtn'> Start </button>");

	$(playerInput).append(nameInputBox);
	$(playerInput).append(newPlayerBtn);
	$(".nameInput").append(playerInput);

	//first check to see if this player existed and is exiting game

	database.ref().once("value",function(snapshot){
		if(!snapshot.child("Turn").exists()){
			database.ref().child("Turn").set(0);
		}
	})

	// to get enterPlayer function to work, uncomment this line:
	enterPlayer(); 
}


//Event listener for start click button:

//on start click do the following:

	//prevent default
	//take a snapshot of database
	// if Players child exists
	// 	count number of children in Players child
	// 		if number of children is 2
	// 			alert (too many players)
	// 		else if snapshot of players does not have a child called player 1
	// 			create Players child and add just submitted name to Players object as player 1 (include losses, name, and wins)
	//			remove submit form and button
	// 		else if snapshot of players does not have a child called player 2
	// 			create Players child and add just submitted name to Players object as player 2 (include losses, name, and wins)
	//			remove submit form and button
	// if Players child does not exist
	// 	create Players child and add just submitted name to Players object as player 1 (include losses, name, and wins)


//Event listener for firebase (when it changes, update html):

//when firebase Players child has a child added:
	// take a snapshot of the database
	// 	if name of child added is player 1
	// 		update player 1 box with name of player and wins and losses
	// 	if name of child added is player 2
	// 		update player 2 box with name of player and wins and losses






//This function enterPlayer works, but must un-comment enterPlayer() call in window.onload above; this code should be deleted when I get the above to work; it uses two event listeners and is much simpler and will work better

function enterPlayer(){
	$(".newPlayerBtn").on("click", function(){
		event.preventDefault();
		database.ref("Players").once("value",function(snapshot){
			if(snapshot.child("Player2").exists()&&snapshot.child("Player1").exists()){
				alert("Too many players");
				return;
			}
			else if (!snapshot.child("Player1").exists()){
				var playerName = $(".nameInputBox").val().trim();
				database.ref("Players").child("Player1").set({
					name: playerName,
					losses: 0,
					wins: 0
				})
				$(".playerName").text(playerName);
				$(".playerNum").text(1);
				$(".nameInput").empty();

				$(".player1Name").text(playerName);
				$(".player2Name").text("Waiting for Player 2");
			}
			else if (!snapshot.child("Player2").exists()){
				var playerName = $(".nameInputBox").val().trim();
				database.ref("Players").child("Player2").set({
					name: playerName,
					losses: 0,
					wins: 0
				})
				$(".playerName").text(playerName);
				$(".playerNum").text(2);
				$(".nameInput").empty();
				
				$(".player2Name").text(playerName);
			}
			
			
		})
	})
}

console.log($(".playerNum").text())

//When 2 users start game, set Turn equal to 1 to start the game:

database.ref("Players").on("value", function(snapshot){
	var numPlayers = snapshot.numChildren();
	if(numPlayers === 2){
		database.ref().child("Turn").set(1);
	}
	console.log(numPlayers);
})

// Event listener for when Turn changes in database:

database.ref("Turn").on("value", function(snapshot){
	if(snapshot.val() === 1){
		console.log("pee")
		player1Turn();
	}
	if (snapshot.val() === 2) {
		console.log("poop")
		player2Turn();
	}
	
});

function player1Turn(){
	if($(".playerNum").text() === "1" ){
		console.log("this is player 1");
		$(".turnMessage").text("It's Your Turn!");

		var player1Rock = $("<button class = 'player1Rock'> Rock </button>");
		$(".player1Rock").append(player1Rock);
	}
	else{
		console.log("this is player 2");
		$(".turnMessage").text("It's NOT Your Turn!");
	}
}

function player2Turn(){
	if($(".playerNum").text() === "2" ){
		console.log("this is player 2");
		$(".turnMessage").text("It's Your Turn!");
	}
	else{
		console.log("this is player 1");
		$(".turnMessage").text("It's NOT Your Turn!");
	}
}