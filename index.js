// 21/01/2023
// Ewan Ridge
// Simple Fighing Game Project

const canvas = document.querySelector('canvas');
// context is used to draw to the canvas
const ctx = canvas.getContext('2d');

// set the canvas width and height to a 16x9 ratio
canvas.width = 1024;
canvas.height = 576;

// draw a rectangle of size canvas width by canvas height
ctx.fillRect(0, 0, canvas.width, canvas.height);

// create a constant for the gravity
const gravity = 0.7;

// instantiate a new sprite called background which will be the background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

// instantiate a new sprite called shop which will be the shop
const shop = new Sprite({
  position: {
    x: 625,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
  framesHold: 5,
});

// instantiate a new fighter called player with position 0,0
// and velocity 0,10
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  framesHold: 5,
  sprites: {
    idleRight: { imageSrc: './img/samuraiMack/idle.png', framesMax: 8 },
    runRight: { imageSrc: './img/samuraiMack/run.png', framesMax: 8 },
    jumpRight: { imageSrc: './img/samuraiMack/jump.png', framesMax: 2 },
    fallRight: { imageSrc: './img/samuraiMack/fall.png', framesMax: 2 },
    attack1Right: {
      imageSrc: './img/samuraiMack/attack1.png',
      framesMax: 6,
    },
    attack2Right: {
      imageSrc: './img/samuraiMack/attack2.png',
      framesMax: 6,
    },
    takeHitRight: {
      imageSrc: './img/samuraiMack/take hit - white silhouette.png',
      framesMax: 4,
    },
    deathRight: { imageSrc: './img/samuraiMack/death.png', framesMax: 6 },

    idleLeft: { imageSrc: './img/samuraiMack/idle_edited.png', framesMax: 8 },
    runLeft: { imageSrc: './img/samuraiMack/run_edited.png', framesMax: 8 },
    jumpLeft: { imageSrc: './img/samuraiMack/jump_edited.png', framesMax: 2 },
    fallLeft: { imageSrc: './img/samuraiMack/fall_edited.png', framesMax: 2 },
    attack1Left: {
      imageSrc: './img/samuraiMack/attack1_edited.png',
      framesMax: 6,
    },
    attack2Left: {
      imageSrc: './img/samuraiMack/attack2_edited.png',
      framesMax: 6,
    },
    takeHitLeft: {
      imageSrc: './img/samuraiMack/take hit - white silhouette_edited.png',
      framesMax: 4,
    },
    deathLeft: { imageSrc: './img/samuraiMack/death_edited.png', framesMax: 6 },
  },
  attackBoxRight: {
    offset: { x: 70, y: 50 },
    width: 180,
    height: 60,
  },
  attackBoxLeft: {
    offset: { x: -184, y: 50 },
    width: 180,
    height: 60,
  },
  defaultKey: 'd',
});

// instantiate a new fighter called player with position 400,100
// and velocity 0,10
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/kenji/idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 171,
  },
  framesHold: 5,
  sprites: {
    idleLeft: { imageSrc: './img/kenji/idle.png', framesMax: 4 },
    runLeft: { imageSrc: './img/kenji/run.png', framesMax: 8 },
    jumpLeft: { imageSrc: './img/kenji/jump.png', framesMax: 2 },
    fallLeft: { imageSrc: './img/kenji/fall.png', framesMax: 2 },
    attack1Left: { imageSrc: './img/kenji/attack1.png', framesMax: 4 },
    attack2Left: { imageSrc: './img/kenji/attack2.png', framesMax: 4 },
    takeHitLeft: { imageSrc: './img/kenji/take hit.png', framesMax: 3 },
    deathLeft: { imageSrc: './img/kenji/death.png', framesMax: 7 },

    idleRight: { imageSrc: './img/kenji/idle_edited.png', framesMax: 4 },
    runRight: { imageSrc: './img/kenji/run_edited.png', framesMax: 8 },
    jumpRight: { imageSrc: './img/kenji/jump_edited.png', framesMax: 2 },
    fallRight: { imageSrc: './img/kenji/fall_edited.png', framesMax: 2 },
    attack1Right: { imageSrc: './img/kenji/attack1_edited.png', framesMax: 4 },
    attack2Right: { imageSrc: './img/kenji/attack2_edited.png', framesMax: 4 },
    takeHitRight: { imageSrc: './img/kenji/take hit_edited.png', framesMax: 3 },
    deathRight: { imageSrc: './img/kenji/death_edited.png', framesMax: 7 },
  },
  attackBoxLeft: {
    offset: { x: -160, y: 60 },
    width: 165,
    height: 60,
  },
  attackBoxRight: {
    offset: { x: 60, y: 60 },
    width: 165,
    height: 60,
  },
  defaultKey: 'ArrowLeft',
});

console.log(player);

// keys object to hold all the keys that we are using
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw the background
  background.update();
  // draw the shop
  shop.update();
  // add a white haze to the background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw the player using the update method
  player.update();
  // draw the enemy using the update method
  enemy.update();

  // set default x velocity to 0
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.switchSprite('runLeft');
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.switchSprite('runRight');
    player.velocity.x = 5;
  } else {
    if (player.lastKey === 'a') {
      player.switchSprite('idleLeft');
    } else if (player.lastKey === 'd') {
      player.switchSprite('idleRight');
    }
  }
  // player jump
  if (player.velocity.y < 0) {
    if (player.lastKey === 'a') {
      player.switchSprite('jumpLeft');
    } else if (player.lastKey === 'd') {
      player.switchSprite('jumpRight');
    }
  } else if (player.velocity.y > 0) {
    if (player.lastKey === 'a') {
      player.switchSprite('fallLeft');
    } else if (player.lastKey === 'd') {
      player.switchSprite('fallRight');
    }
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.switchSprite('runLeft');
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.switchSprite('runRight');
    enemy.velocity.x = 5;
  } else {
    if (enemy.lastKey === 'ArrowLeft') {
      enemy.switchSprite('idleLeft');
    } else if (enemy.lastKey === 'ArrowRight') {
      enemy.switchSprite('idleRight');
    }
  }
  // enemy jump
  if (enemy.velocity.y < 0) {
    if (enemy.lastKey === 'ArrowLeft') {
      enemy.switchSprite('jumpLeft');
    } else if (enemy.lastKey === 'ArrowRight') {
      enemy.switchSprite('jumpRight');
    }
  } else if (enemy.velocity.y > 0) {
    if (enemy.lastKey === 'ArrowLeft') {
      enemy.switchSprite('fallLeft');
    } else if (enemy.lastKey === 'ArrowRight') {
      enemy.switchSprite('fallRight');
    }
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    // kenji takes damage
    enemy.takeHit(10);
    player.isAttacking = false;
    gsap.to('#enemyHealth', {
      width: enemy.health + '%',
    });
  }
  // if player misses attack
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  // detect for collision & player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 2
  ) {
    // samurai mack takes damage
    player.takeHit(6.67);
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {
      width: player.health + '%',
    });
  }
  // if enemy misses attack
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

// add an event listener for the keydown event so that we can move the player
// and attack with the keyboard
window.addEventListener('keydown', (event) => {
  // if r is pressed reset game
  if (event.key === 'r') {
    player.image = player.sprites.idleRight.image;
    player.lastKey = 'd';
    player.position = {x: 0, y:0};
    gsap.to('#playerHealth', {
      width: 100 + '%',
    });
    player.health = 100;
    player.dead = false;
    enemy.image = enemy.sprites.idleLeft.image;
    enemy.lastKey  = 'ArrowLeft';
    enemy.position = {x: canvas.width - 100, y: 0};
    gsap.to('#enemyHealth', {
      width: 100 + '%',
    });
    enemy.health = 100;
    enemy.dead = false;
    timer = 60;
    document.querySelector('#timer').innerHTML = 60;
    document.querySelector('#displayText').style.display = 'none';
  }
  // if the player is dead stop moving
  if (!player.dead) {
    switch (event.key) {
      // player keys
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        if (player.velocity.y === 0) {
          player.velocity.y = -20;
        }
        break;
      case 's':
        player.attack();
        break;
    }
  }
  // if the enemy is dead stop moving
  if (!enemy.dead) {
    switch (event.key) {
      // enemy keys
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        if (enemy.velocity.y === 0) {
          enemy.velocity.y = -20;
        }
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

// add an event listener for the keydown event so that we can stop the player
// from moving when we release the key
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    // player keys
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    // enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
  console.log(event.key);
});
