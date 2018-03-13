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

var reloadPlayer

// window.onbeforeunload = function(){
// 	alert("are you sure")
// 	reloadPlayer = $(".playerNum").text();
// 	console.log(reloadPlayer)
// }

$(window).on("unload",function(){
	console.log("are you sure?")
});

window.onload = function(){
	var playerInput = $("<form></form>");
	var nameInputBox = $("<input type = 'text' class = 'nameInputBox' placeholder = 'Name'></input>");
	var newPlayerBtn = $("<button class = 'newPlayerBtn'> Start </button>");

	$(playerInput).append(nameInputBox);
	$(playerInput).append(newPlayerBtn);
	$(".nameInput").append(playerInput);

	//Hide choice buttons for both clients

	$(".choiceBtn").hide();

	//first check to see if this player existed and is exiting game

	database.ref().child("Players").remove();
	database.ref().child("Turn").remove();
	database.ref().child("pickWinner").remove();

	// database.ref().child("Players").child("Player1").remove();

	database.ref().once("value",function(snapshot){
		if(!snapshot.child("Turn").exists()){
			database.ref().child("Turn").set(0);
		}
		if(!snapshot.child("Players").child("numPlayers").exists()){
			database.ref("Players").child("numPlayers").set(0);
		}
		if(!snapshot.child("pickWinner").exists()){
			database.ref().child("pickWinner").set(0);
		}
		
	})

	// to get enterPlayer function to work, uncomment this line:
	// enterPlayer();   


	//Event listener for start click button:

	$(".newPlayerBtn").on("click",function(){
	//on start click do the following:
	console.log("test")
	//prevent default
	event.preventDefault();
	//take a snapshot of database
	database.ref("Players").once("value", function(snapshot){
		// if Players child exists
	// 	count number of children in Players child
	// 		if number of children is 2
	// 			alert (too many players)
		if(snapshot.child("Player2").exists()&&snapshot.child("Player1").exists()){
				alert("Too many players");
				return;
		}
	// 		else if snapshot of players does not have a child called player 1
	// 			create Players child and add just submitted name to Players object as player 1 (include losses, name, and wins)
		else if (!snapshot.child("Player1").exists()){
				var playerName = $(".nameInputBox").val().trim();
				database.ref("Players").child("Player1").set({
					name: playerName,
					losses: 0,
					wins: 0
				})
				database.ref("Players").child("numPlayers").set(snapshot.child("numPlayers").val() + 1);
				$(".nameInput").empty();
				$(".playerName").text(playerName);
				$(".playerNum").text(1);
			}
	// 		else if snapshot of players does not have a child called player 2
	// 			create Players child and add just submitted name to Players object as player 2 (include losses, name, and wins)
		else if (!snapshot.child("Player2").exists()){
				var playerName = $(".nameInputBox").val().trim();
				database.ref("Players").child("Player2").set({
					name: playerName,
					losses: 0,
					wins: 0
				})
				database.ref("Players").child("numPlayers").set(snapshot.child("numPlayers").val() + 1);
				$(".nameInput").empty();
				$(".playerName").text(playerName);
				$(".playerNum").text(2);
			}
	})
	
	});

	//Event listener for player choice button click

	$(".choiceBtn").on("click", function(event){
		var btnChoice = $(this).attr("data-name");
		console.log($(this).attr("data-name"));
		database.ref().once("value",function(snapshot){
		if(snapshot.child("Turn").val() === 1){
				database.ref().child("Turn").set(2);
				database.ref().child("Players").child("Player1").update({
					choice: btnChoice
				})
				$(".player1Choice").text(btnChoice);
			}
		else if(snapshot.child("Turn").val() === 2){
			if(snapshot.child("pickWinner").val() === 0){
				$(".player2Rock").hide();
				$(".player2Paper").hide();
				$(".player2Scissors").hide();
				setTimeout(pauseThenSwitch,3000);
			}
			else{
				database.ref().child("Turn").set(1);
			}
			
			database.ref().child("Players").child("Player2").update({
				choice: btnChoice
			})
			$(".player2Choice").text(btnChoice);
			database.ref().child("pickWinner").set(1);
				
			}
		})
	})

}

function pauseThenSwitch(){
	database.ref().child("Turn").set(1);
}




//Event listener for firebase (when it changes, update html):

//when firebase Players child has a child added:
	// take a snapshot of the database
database.ref("Players").on("value",function(snapshot){
	var player1 = snapshot.child("Player1").val();
	var player2 = snapshot.child("Player2").val();
	if(snapshot.child("Player1").exists()){
		$(".player1Name").text(player1.name);
		$(".player1Wins").text(player1.wins);
		$(".player1Losses").text(player1.losses);

	}
	if(snapshot.child("Player2").exists()){
		$(".player2Name").text(player2.name);
		$(".player2Wins").text(player2.wins);
		$(".player2Losses").text(player2.losses);
	}
})

//Event listener for firebase when a choice is updated:

// database.ref("Players").child("Player1").child("choice").on("value", function(snapshot){
// 	var choice = snapshot.val();
// 	$(".player1Choice").text(choice);
// 	if($(".playerNum").text() === "2" ){
// 		$(".player1Choice").hide();
// 	}
// })

// database.ref("Players").child("Player2").child("choice").on("value", function(snapshot){
// 	console.log(snapshot.val());
// 	var choice = snapshot.val();
// 		$(".player2Choice").text(choice);
// 		if($(".playerNum").text() === "1" ){
// 			$(".player2Choice").hide();
// 		}
// })


//Event listener that picks winner when pickWinner database value becomes 1:

database.ref().child("pickWinner").on("value", function(snapshot){
	if(snapshot.val() === 1){
		compareChoices();
	}
})



function compareChoices(){
	database.ref().once("value", function(snapshot){
		var player1Choice = snapshot.child("Players").child("Player1").child("choice").val();
		var player2Choice = snapshot.child("Players").child("Player2").child("choice").val();
		var player1Name = snapshot.child("Players").child("Player1").child("name").val();
		var player2Name = snapshot.child("Players").child("Player2").child("name").val();
		var player1Wins = snapshot.child("Players").child("Player1").child("wins").val();
		var player2Wins = snapshot.child("Players").child("Player2").child("wins").val();
		var player1Losses = snapshot.child("Players").child("Player1").child("losses").val();
		var player2Losses = snapshot.child("Players").child("Player2").child("losses").val();

		if(player1Choice === player2Choice){
			$(".messageRow").text("Tie");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);
			
			setTimeout(clearChoices,3000);
		}
		if(player1Choice == "rock" && player2Choice == "paper"){
			$(".messageRow").text(player2Name + " Wins!");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);

			database.ref("Players").child("Player1").child("losses").set(player1Losses + 1);
			database.ref("Players").child("Player2").child("wins").set(player2Wins + 1);
			
			setTimeout(clearChoices,3000);
		}
		if(player1Choice == "rock" && player2Choice == "scissors"){
			$(".messageRow").text(player1Name + " Wins!");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);

			database.ref("Players").child("Player1").child("wins").set(player1Wins + 1);
			database.ref("Players").child("Player2").child("losses").set(player2Losses + 1);
			
			setTimeout(clearChoices,3000);
		}
		if(player1Choice == "paper" && player2Choice == "rock"){
			$(".messageRow").text(player1Name + " Wins!");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);
			
			database.ref("Players").child("Player1").child("wins").set(player1Wins + 1);
			database.ref("Players").child("Player2").child("losses").set(player2Losses + 1);

			setTimeout(clearChoices,3000);
		}
		if(player1Choice == "paper" && player2Choice == "scissors"){
			$(".messageRow").text(player2Name + " Wins!");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);

			database.ref("Players").child("Player1").child("losses").set(player1Losses + 1);
			database.ref("Players").child("Player2").child("wins").set(player2Wins + 1);
			
			setTimeout(clearChoices,3000);
		}
		if(player1Choice == "scissors" && player2Choice == "paper"){
			$(".messageRow").text(player1Name + " Wins!");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);

			database.ref("Players").child("Player1").child("wins").set(player1Wins + 1);
			database.ref("Players").child("Player2").child("losses").set(player2Losses + 1);
			
			setTimeout(clearChoices,3000);
		}
		if(player1Choice == "scissors" && player2Choice == "rock"){
			$(".messageRow").text(player2Name + " Wins!");
			$(".player1Choice").text(player1Choice);
			$(".player2Choice").text(player2Choice);

			database.ref("Players").child("Player1").child("losses").set(player1Losses + 1);
			database.ref("Players").child("Player2").child("wins").set(player2Wins + 1);
			
			setTimeout(clearChoices,3000);
		}
	})
}

//Timeout function:

function clearChoices(){
	$(".player1Choice").empty();
	$(".player2Choice").empty();
	$(".messageRow").empty();
	database.ref().child("pickWinner").set(0);
}


// function newChildHTML(player){
// 	console.log(player);
// 	console.log("testing")
// 	if($(".player1Name").text() == "Waiting for Player 1"){
// 		$(".player1Name").text(player.name);
// 	};
// }


	// 	if name of child added is player 1
	// 		update player 1 box with name of player and wins and losses
	//			remove submit form and button
	// 	if name of child added is player 2
	// 		update player 2 box with name of player and wins and losses
	//			remove submit form and button

//This function enterPlayer works, but must un-comment enterPlayer() call in window.onload above; this code should be deleted when I get the above to work; it uses two event listeners and is much simpler and will work better

// function enterPlayer(){
// 	$(".newPlayerBtn").on("click", function(){
// 		event.preventDefault();
// 		database.ref("Players").once("value",function(snapshot){
// 			if(snapshot.child("Player2").exists()&&snapshot.child("Player1").exists()){
// 				alert("Too many players");
// 				return;
// 			}
// 			else if (!snapshot.child("Player1").exists()){
// 				var playerName = $(".nameInputBox").val().trim();
// 				database.ref("Players").child("Player1").set({
// 					name: playerName,
// 					losses: 0,
// 					wins: 0
// 				})
// 				$(".playerName").text(playerName);
// 				$(".playerNum").text(1);
// 				$(".nameInput").empty();

// 				$(".player1Name").text(playerName);
// 				$(".player2Name").text("Waiting for Player 2");
// 			}
// 			else if (!snapshot.child("Player2").exists()){
// 				var playerName = $(".nameInputBox").val().trim();
// 				database.ref("Players").child("Player2").set({
// 					name: playerName,
// 					losses: 0,
// 					wins: 0
// 				})
// 				$(".playerName").text(playerName);
// 				$(".playerNum").text(2);
// 				$(".nameInput").empty();
				
// 				$(".player2Name").text(playerName);
// 			}
			
			
// 		})
// 	})
// }

console.log($(".playerNum").text())

//When 2 users start game, set Turn equal to 1 to start the game:

database.ref("Players").child("numPlayers").on("value", function(snapshot){
	var numPlayers = snapshot.val();
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

		$(".player1Rock").show();
		$(".player1Paper").show();
		$(".player1Scissors").show();

	}
	else{
		console.log("this is player 2");
		$(".turnMessage").text("It's NOT Your Turn!");
		$(".player2Rock").hide();
		$(".player2Paper").hide();
		$(".player2Scissors").hide();
	}
}

function player2Turn(){
	if($(".playerNum").text() === "2" ){
		console.log("this is player 2");
		$(".turnMessage").text("It's Your Turn!");

		$(".player2Rock").show();
		$(".player2Paper").show();
		$(".player2Scissors").show();
	}
	else{
		console.log("this is player 1");
		$(".turnMessage").text("It's NOT Your Turn!");
		$(".player1Rock").hide();
		$(".player1Paper").hide();
		$(".player1Scissors").hide();
	}
}



