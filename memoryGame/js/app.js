/*
 * Create a list that holds all of your cards
 */
const cardArray = ['fa-anchor','fa-bolt','fa-leaf', 'fa-bomb','fa-bolt','fa-diamond','fa-paper-plane-o','fa-cube','fa-anchor','fa-leaf','fa-bicycle','fa-diamond','fa-bomb','fa-bicycle','fa-paper-plane-o', 'fa-cube'];
    
// Set global variables for the DOM
const deck = document.querySelector(".deck");
const fa = document.querySelector(".x");

const moves = document.querySelector(".moves");
const playAgain = document.querySelector(".playAgain");
const restart = document.querySelector(".restart");
const stars = document.querySelector(".stars");
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modalText");
let timer = document.querySelector(".timer");

//   timer's variables
let interval;
let second = 0;
let minute = 0;
let timeStart = false;


let openCards = [];
let matches = 0;
let movesNum = moves.textContent;
let numberOfStars = 3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startNewGame() {
	resetTimer();
	timer.style.display = "none";
	timeStart = false;
	timer.textContent = minute + " minutes " + second + " seconds";
	shuffle(cardArray);
	openCards = [];
	matches = 0;
	moves.textContent = 0;
	movesNum = moves.textContent;

	// Get rid of classes and, thus, slip all cards to backside
	
	for (let i = 0; i < cardArray.length; i++) {
		let deckElement = deck.getElementsByTagName("li");
		let classElement = deckElement[i].getAttribute("class");
		deckElement[i].className = "";
		deckElement[i].classList.add("card");

		let iconElement = deck.getElementsByTagName("i");
		let iconClass = iconElement[i].getAttribute("class");
		iconElement[i].className = "";
		iconElement[i].classList.add("fa", cardArray[i]);
	}

	// Return stars to panel
	stars.innerHTML = 
	'<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
	numberOfStars = 3;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// functions to play Memory

function showCard(card) {
	card.classList.add("open", "show");
}

function match() {
	openCards[0].classList.remove("open", "show");
	openCards[0].classList.add("match");
	openCards[1].classList.remove("open", "show");
	openCards[1].classList.add("match");
	openCards = [];
	matches++;
}
function addRed(){
	openCards[0].classList.add("foolse");
	openCards[1].classList.add("foolse");
	
}
function noMatch() {
	setTimeout(function() {
		openCards[0].classList.remove("open", "show","foolse");
		openCards[1].classList.remove("open", "show","foolse");
		openCards = [];
	}, 800)
}

function addMove(card) {
	
	if (!(card.classList.contains("match"))) {
		movesNum++;
		moves.innerText = movesNum;
	}
}

// Set timer at 00:00

function resetTimer() {
	clearInterval(interval);
	second = 0;
	minute = 0;
}

// Start timer
function startTimer() {
	interval = setInterval(function() {
		timer.textContent = minute + " minutes " + second + " seconds ";
		second++;
		if (second === 60) {
			minute++;
			second = 0;
		}
	}, 1000)
}

function gameOver() {
	if (matches === 8) {
		modal.style.display = "block";
		modalText.textContent = "Congratulations! You made it in " + minute + " minutes and " + second + " seconds!\nAll in all, you completed the game with  " + movesNum + " moves and earned " + numberOfStars + " stars!";
		startNewGame();
	}
}

// event listener for restart button
restart.addEventListener("click", startNewGame);
// event listener for playAgain button
playAgain.addEventListener("click", function() {
	modal.style.display = "none";
	timer.style.display = "none";
	startNewGame();
})

// event listener for starting the game from card 
deck.addEventListener("click",function(event) {
	
	let card = event.target;
	// start timer
	if (!timeStart) {
		startTimer();
		timeStart = true;
		timer.style.display = "inline-block";
	}

	// for closed cards
	if (!card.classList.contains("open") && !card.classList.contains("fa")) {

		if (openCards.length < 2) {
				showCard(card);
				openCards.push(card);
				
		}
		if (openCards.length === 2) {
			if (openCards[0].innerHTML === openCards[1].innerHTML) {
				match();
			} else {
				addRed();
				noMatch();
				addMove(card);
			}
			//  reset stars number 
			if (movesNum === 15) {
				stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
				numberOfStars--;
			} else if (movesNum === 21) {
				stars.innerHTML = '<li><i class="fa fa-star"></i></li>';
				numberOfStars--;
			}
		}
		gameOver();
	}
})

startNewGame();