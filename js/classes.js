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
    attackBox = { offset: {}, width: undefined, height: undefined },
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
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    };
    this.colour = colour;
    this.isAttacking;
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
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw the attack box
    //  ctx.fillRect(
    //    this.attackBox.position.x,
    //    this.attackBox.position.y,
    //    this.attackBox.width,
    //    this.attackBox.height
    //  );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity function
    // if the sprite is touching the bottom of the screen, the velocity is set to 0
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330.29;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
  }

  takeHit(damage) {
    // update health bar
    this.health -= damage;

    // death check
    if (this.health <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }

  switchSprite(sprite) {
    // overides all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.framesMax - 1
    )
      return;
    // overides all other animations with the takeHit animation
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.framesMax - 1
    )
      return;
    // overides all other animations with the death animation
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    // changes the image of the sprite depending on the desired scenario
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'attack2':
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.currentFrame = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
