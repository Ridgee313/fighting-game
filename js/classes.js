// 21/01/2023
// Ewan Ridge
// Simple Fighing Game Project - Classes

// Sprite class to create player and enemy sprites
class Sprite {
  // constructor method sets the attributes of the sprite
  // wrap parameters so order doesn't matter
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesHold,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = framesHold;
    this.offset = offset;
  }
  // draw method draws the sprite
  draw() {
    ctx.drawImage(
      this.image,
      (this.image.width / this.framesMax) * this.currentFrame,
      0,
      this.image.width / this.framesMax,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesMax - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  // update method updates the position of the sprite
  update() {
    this.draw();
    this.animateFrames();
  }
}

// fighter class to create player and enemy with functionality
class Fighter extends Sprite {
  // constructor method sets the attributes of the sprite
  // wrap parameters so order doesn't matter
  constructor({
    position,
    velocity,
    colour = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesHold,
    offset = { x: 0, y: 0 },
    sprites,
    attackBoxRight = { offset: {}, width: undefined, height: undefined },
    attackBoxLeft = { offset: {}, width: undefined, height: undefined },
    lastKey,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      framesHold,
      offset,
    });
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastkey = lastKey;
    this.attackBoxRight = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBoxRight.width,
      height: attackBoxRight.height,
      offset: attackBoxRight.offset,
    };
    this.attackBoxLeft = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBoxLeft.width,
      height: attackBoxLeft.height,
      offset: attackBoxLeft.offset,
    };
    this.colour = colour;
    this.isAttacking = false;
    this.health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  // update method updates the position of the sprite
  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrames();
    }
    // manually update the position of the attack box
    this.attackBoxRight.position.x =
      this.position.x + this.attackBoxRight.offset.x;
    this.attackBoxRight.position.y =
      this.position.y + this.attackBoxRight.offset.y;
    this.attackBoxLeft.position.x =
      this.position.x + this.attackBoxLeft.offset.x;
    this.attackBoxLeft.position.y =
      this.position.y + this.attackBoxLeft.offset.y;

    // draw the attack boxes
    // ctx.fillRect(
    //   this.attackBoxRight.position.x,
    //   this.attackBoxRight.position.y,
    //   this.attackBoxRight.width,
    //   this.attackBoxRight.height
    // );
    // ctx.fillRect(
    //   this.attackBoxLeft.position.x,
    //   this.attackBoxLeft.position.y,
    //   this.attackBoxLeft.width,
    //   this.attackBoxLeft.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity function
    // if the sprite is touching the bottom of the screen, the velocity is set to 0
    // else gravity is added to the velocity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330.29;
    }
    //   else if (
    //   this.position.y + this.height >= canvas.height - 246 &&
    //   this.position.x >= canvas.width - 410 &&
    //   this.position.x <= canvas.width - 134
    // ) {
    //   this.velocity.y = 0;
    //   this.position.y = 180.29;
    // }
    else this.velocity.y += gravity;

    if (
      this.position.y + this.height <= 327 &&
      this.position.y + this.height + this.velocity.y >= 327 &&
      this.position.x + this.width >= 628 &&
      this.position.x <= 949
    ) {
      this.velocity.y = 0;
      this.position.y = 176.99999999999935;
    }
  }

  attack() {
    if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
      this.switchSprite('attack1Left');
    } else if (this.lastKey === 'd' || this.lastKey === 'ArrowRight') {
      this.switchSprite('attack1Right');
    }
    this.isAttacking = true;
  }

  takeHit(damage) {
    // update health bar
    this.health -= damage;

    // death check
    if (this.health <= 0) {
      if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
        this.switchSprite('deathLeft');
      } else if (this.lastKey === 'd' || this.lastKey === 'ArrowRight') {
        this.switchSprite('deathRight');
      }
    } else {
      if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
        this.switchSprite('takeHitLeft');
      } else if (this.lastKey === 'd' || this.lastKey === 'ArrowRight') {
        this.switchSprite('takeHitRight');
      }
    }
  }

  switchSprite(sprite) {
    // gives death highest priority
    if (sprite !== 'deathRight' && sprite !== 'deathLeft') {
      // overides all other animations with the death animation
      if (
        this.image === this.sprites.deathLeft.image ||
        this.image === this.sprites.deathRight.image
      ) {
        if (this.currentFrame === this.sprites.deathLeft.framesMax - 1)
          this.dead = true;
        return;
      }
      // overides all other animations with the attack animation
      if (
        (this.image === this.sprites.attack1Left.image ||
          this.image === this.sprites.attack1Right.image) &&
        this.currentFrame < this.sprites.attack1Left.framesMax - 1
      )
        return;
      // overides all other animations with the takeHit animation
      if (
        (this.image === this.sprites.takeHitLeft.image ||
          this.image === this.sprites.takeHitRight.image) &&
        this.currentFrame < this.sprites.takeHitLeft.framesMax - 1
      )
        return;
    }

    // changes the image of the sprite depending on the desired scenario
    switch (sprite) {
      case 'idleLeft':
        if (this.image !== this.sprites.idleLeft.image) {
          this.image = this.sprites.idleLeft.image;
          this.framesMax = this.sprites.idleLeft.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'runLeft':
        if (this.image !== this.sprites.runLeft.image) {
          this.image = this.sprites.runLeft.image;
          this.framesMax = this.sprites.runLeft.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'jumpLeft':
        if (this.image !== this.sprites.jumpLeft.image) {
          this.image = this.sprites.jumpLeft.image;
          this.framesMax = this.sprites.jumpLeft.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'fallLeft':
        if (this.image !== this.sprites.fallLeft.image) {
          this.image = this.sprites.fallLeft.image;
          this.framesMax = this.sprites.fallLeft.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'attack1Left':
        if (this.image !== this.sprites.attack1Left.image) {
          this.image = this.sprites.attack1Left.image;
          this.framesMax = this.sprites.attack1Left.framesMax;
          this.currentFrame = 0;
        }
        break;
      // case 'attack2Left':
      //   if (this.image !== this.sprites.attack2Left.image) {
      //     this.image = this.sprites.attack2Left.image;
      //     this.framesMax = this.sprites.attack2Left.framesMax;
      //     this.currentFrame = 0;
      //   }
      //   break;
      case 'takeHitLeft':
        if (this.image !== this.sprites.takeHitLeft.image) {
          this.image = this.sprites.takeHitLeft.image;
          this.framesMax = this.sprites.takeHitLeft.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'deathLeft':
        if (this.image !== this.sprites.deathLeft.image) {
          this.image = this.sprites.deathLeft.image;
          this.framesMax = this.sprites.deathLeft.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'idleRight':
        if (this.image !== this.sprites.idleRight.image) {
          this.image = this.sprites.idleRight.image;
          this.framesMax = this.sprites.idleRight.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'runRight':
        if (this.image !== this.sprites.runRight.image) {
          this.image = this.sprites.runRight.image;
          this.framesMax = this.sprites.runRight.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'jumpRight':
        if (this.image !== this.sprites.jumpRight.image) {
          this.image = this.sprites.jumpRight.image;
          this.framesMax = this.sprites.jumpRight.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'fallRight':
        if (this.image !== this.sprites.fallRight.image) {
          this.image = this.sprites.fallRight.image;
          this.framesMax = this.sprites.fallRight.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'attack1Right':
        if (this.image !== this.sprites.attack1Right.image) {
          this.image = this.sprites.attack1Right.image;
          this.framesMax = this.sprites.attack1Right.framesMax;
          this.currentFrame = 0;
        }
        break;
      // case 'attack2Right':
      //   if (this.image !== this.sprites.attack2Right.image) {
      //     this.image = this.sprites.attack2Right.image;
      //     this.framesMax = this.sprites.attack2Right.framesMax;
      //     this.currentFrame = 0;
      //   }
      //   break;
      case 'takeHitRight':
        if (this.image !== this.sprites.takeHitRight.image) {
          this.image = this.sprites.takeHitRight.image;
          this.framesMax = this.sprites.takeHitRight.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'deathRight':
        if (this.image !== this.sprites.deathRight.image) {
          this.image = this.sprites.deathRight.image;
          this.framesMax = this.sprites.deathRight.framesMax;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
