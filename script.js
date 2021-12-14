
var activePlayer, scores, roundScore, gameInProgress, worker;

// Game functions
function init() {
  scores = [0, 0];
  activePlayer = 0;
  roundScore = 0;
  gameInProgress = true;

  document.querySelector('.dice').style.display = 'none';
  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';
  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
}

function roll() {
  if (gameInProgress) {
    if (worker) {
      worker.postMessage('dice');
    } else {
      // Fallback if browser incompatibility (For IE)
      var dice = Math.floor(Math.random() * 6) + 1;
      computeDice(dice)
    }
  }
}

function computeDice(data) {
  let dice = data;
  var diceDOM = document.querySelector('.dice');
  diceDOM.style.display = 'block';
  diceDOM.src = 'images/' + 'dice-' + dice + '.png';
  if (dice !== 1) {
    // Add score
    roundScore += dice;
    document.querySelector('#current-' + activePlayer).textContent = roundScore;
  } else {
    // Next player
    nextPlayer();
  }

}

function hold() {
  if (gameInProgress) {
    // Add CURRENT score to GLOBAL score
    scores[activePlayer] += roundScore;

    // Update UI
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

    // Check if player won the game
    if (scores[activePlayer] >= 100) {
      document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
      document.querySelector('.dice').style.display = 'none';
      document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
      document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      gameInProgress= false;
    } else {
      // Next player
      nextPlayer();
    }
  }
}

function nextPlayer() {
  // Next player
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  roundScore = 0;

  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
  document.querySelector('.dice').style.display = 'none';
}

// Worker
function initWorker() {
  return new Worker("worker.js");
}

// Main
init();

if (window.Worker) {
  worker = initWorker();

  worker.onmessage = function (e) {
    if (gameInProgress) {
      // Receive rng dice data from worker
      computeDice(e.data)
    }
  }
}

// Bind events
document.querySelector('.btn-roll').onclick = roll;
document.querySelector('.btn-new').onclick = init;
document.querySelector('.btn-hold').onclick = hold;