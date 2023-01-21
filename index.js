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
    idle: { imageSrc: './img/samuraiMack/idle.png', framesMax: 8 },
    run: { imageSrc: './img/samuraiMack/run.png', framesMax: 8 },
    jump: { imageSrc: './img/samuraiMack/jump.png', framesMax: 2 },
    fall: { imageSrc: './img/samuraiMack/fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/samuraiMack/attack1.png', framesMax: 6 },
    attack2: { imageSrc: './img/samuraiMack/attack2.png', framesMax: 6 },
    takeHit: {
      imageSrc: './img/samuraiMack/take hit - white silhouette.png',
      framesMax: 4,
    },
    death: { imageSrc: './img/samuraiMack/death.png', framesMax: 6 },
  },
  attackBox: {
    offset: { x: 90, y: 50 },
    width: 160,
    height: 60,
  },
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
    idle: { imageSrc: './img/kenji/idle.png', framesMax: 4 },
    run: { imageSrc: './img/kenji/run.png', framesMax: 8 },
    jump: { imageSrc: './img/kenji/jump.png', framesMax: 2 },
    fall: { imageSrc: './img/kenji/fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/kenji/attack1.png', framesMax: 4 },
    attack2: { imageSrc: './img/kenji/attack2.png', framesMax: 4 },
    takeHit: { imageSrc: './img/kenji/take hit.png', framesMax: 3 },
    death: { imageSrc: './img/kenji/death.png', framesMax: 7 },
  },
  attackBox: {
    offset: { x: -165, y: 60 },
    width: 165,
    height: 60,
  },
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
    player.switchSprite('run');
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.switchSprite('run');
    player.velocity.x = 5;
  } else {
    player.switchSprite('idle');
  }
  // player jump
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.switchSprite('run');
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.switchSprite('run');
    enemy.velocity.x = 5;
  } else {
    enemy.switchSprite('idle');
  }
  // enemy jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
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

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 2
  ) {
    // samurai mack takes damage
    player.takeHit(5);
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
