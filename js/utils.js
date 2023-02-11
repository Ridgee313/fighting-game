// 21/01/2023
// Ewan Ridge
// Simple Fighing Game Project - Utilities

// function to handle the collision of 2 rectangles
// used for detecting the collision between the attack boxes
function rectangularCollision({ rectangle1, rectangle2 }) {
  if (rectangle1.lastKey === 'd' || rectangle1.lastKey === 'ArrowRight') {
    return (
      rectangle1.attackBoxRight.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBoxRight.position.x + rectangle1.attackBoxRight.width >=
        rectangle2.position.x &&
      rectangle1.attackBoxRight.position.y + rectangle1.attackBoxRight.height >=
        rectangle2.position.y &&
      rectangle1.attackBoxRight.position.y <=
        rectangle2.position.y + rectangle2.height
    );
  } else if (rectangle1.lastKey === 'a' || rectangle1.lastKey === 'ArrowLeft') {
    return (
      rectangle1.attackBoxLeft.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBoxLeft.position.x + rectangle1.attackBoxLeft.width >=
        rectangle2.position.x &&
      rectangle1.attackBoxLeft.position.y + rectangle1.attackBoxLeft.height >=
        rectangle2.position.y &&
      rectangle1.attackBoxLeft.position.y <=
        rectangle2.position.y + rectangle2.height
    );
  }
}

// function to determine the winner
let gameOver = false;
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
  } else if (enemy.health > player.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
  }
  gameOver = true;
}

// funtion to decrease the time on the timer
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// function to reset all the parts that need resetting
function resetGame({ player, enemy }) {
  player.image = player.sprites.idleRight.image;
  player.lastKey = 'd';
  player.position = { x: 0, y: 0 };
  gsap.to('#playerHealth', {
    width: 100 + '%',
  });
  player.health = 100;
  player.dead = false;
  enemy.image = enemy.sprites.idleLeft.image;
  enemy.lastKey = 'ArrowLeft';
  enemy.position = { x: canvas.width - 100, y: 0 };
  gsap.to('#enemyHealth', {
    width: 100 + '%',
  });
  enemy.health = 100;
  enemy.dead = false;
  timer = 60;
  document.querySelector('#timer').innerHTML = 60;
  document.querySelector('#displayText').style.display = 'none';
}
