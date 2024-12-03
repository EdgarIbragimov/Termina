class Player extends Entity {
  constructor() {
    super();

    this.lifetimes = 3;
    this.direction = "down";
    this.speed = 2;
    this.isAttacking = false;
    this.width = 43;
    this.height = 105;
    this.hitboxOffset = { xOffset: 0, yOffset: 0 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };

    // Анимации игрока
    this.animations = {
      stayDown: {
        imageSource: "tiles/Player/DefaultAnimations/Player_stay_down.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      stayLeft: {
        imageSource: "tiles/Player/DefaultAnimations/Player_stay_left.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      stayRight: {
        imageSource: "tiles/Player/DefaultAnimations/Player_stay_right.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      stayUp: {
        imageSource: "tiles/Player/DefaultAnimations/Player_stay_up.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      walkLeft: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_left/Player_walk_left-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkRight: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_right/Player_walk_right-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkUp: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_up/Player_walk_up-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkDown: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_down/Player_walk_down-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      attack: {
        imageSource: "tiles/Player/AttackAnimations/Player_attack_",
        framerate: 3,
        frameBuffer: 60,
        loop: false,
      },
      death: {
        imageSource: "tiles/Player/DeathAnimations/Player_death/Player_death-",
        framerate: 2,
        frameBuffer: 60,
        loop: false,
      },
      crawl: {
        imageSource: "tiles/Player/CrawlAnimations/Player_crawl_",
        framerate: 3,
        frameBuffer: 60,
        loop: true,
      },
      defaultAnimation: {
        imageSource: "tiles/Player/DefaultAnimations/Player_stay_down.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
    };

    this.currentAnimation = this.animations.stayDown;
    // this.velocity = {
    //   x: 0,
    //   y: 0
    // }

    // this.hitboxOffset = {
    //   xOffset: 18,
    //   yOffset: 18
    // }

    // this.hitbox = {
    //   position: {
    //     x: this.position.x + this.hitboxOffset.xOffset,
    //     y: this.position.y + this.hitboxOffset.yOffset
    //   },
    //   width: 40,
    //   height: 26
    // }

    // this.animations = animation.PLAYER

    // this.frames = {
    //   elapsedFrames: 0,
    //   currentFrame: 0
    // }

    // this.currentAnimation = this.animations.idleRight

    // this.direction = 'right'
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
    // if (this.currentAnimation.finished) {
    //   this.switchAnimation(
    //     this.direction === 'right' ? 'idleRight' : 'idleLeft'
    //   )
    // }
  }

  update() {
    if (!this.isAttacking) {
      if (eventsManager.keys["d"].pressed) {
        this.moveRight();
      }
      if (eventsManager.keys["a"].pressed) {
        this.moveLeft();
      }
      if (eventsManager.keys["w"].pressed) {
        this.moveUp();
      }
      if (eventsManager.keys["s"].pressed) {
        this.moveDown();
      }
      if (
        !eventsManager.keys["w"].pressed &&
        !eventsManager.keys["a"].pressed &&
        !eventsManager.keys["s"].pressed &&
        !eventsManager.keys["d"].pressed
      ) {
        this.stopMoving();
      }
    } else {
      this.velocity = { x: 0, y: 0 };
    }

    physicManager.update(this);

    this.updateAnimation();

    if (this.currentAnimation.finished) {
      this.currentAnimation.finished = false;
      this.frames.currentFrame = 0;

      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        this.switchAnimation(
          this.direction === "down"
            ? "walkDown"
            : this.direction === "up"
            ? "walkUp"
            : this.direction === "left"
            ? "walkLeft"
            : this.direction === "right"
            ? "walkRight"
            : "defaultAnimation"
        );
      } else {
        this.switchAnimation(
          this.direction === "down"
            ? "stayDown"
            : this.direction === "up"
            ? "stayUp"
            : this.direction === "left"
            ? "stayLeft"
            : this.direction === "right"
            ? "stayRight"
            : "defaultAnimation"
        );
      }
    }
  }

  moveLeft() {
    this.velocity.x = -this.speed;
    this.direction = "left";
    this.switchAnimation("walkLeft");
  }

  moveRight() {
    this.velocity.x = this.speed;
    this.direction = "right";
    this.switchAnimation("walkRight");
  }

  moveUp() {
    this.velocity.y = -this.speed;
    this.direction = "up";
    this.switchAnimation("walkUp");
  }

  moveDown() {
    this.velocity.y = this.speed;
    this.direction = "down";
    this.switchAnimation("walkDown");
  }

  stopMoving() {
    this.velocity = { x: 0, y: 0 };
    this.switchAnimation(
      this.direction === "down"
        ? "stayDown"
        : this.direction === "up"
        ? "stayUp"
        : this.direction === "left"
        ? "stayLeft"
        : this.direction === "right"
        ? "stayRight"
        : "defaultAnimation"
    );
  }

  updateAnimation() {
    this.frames.elapsedFrames++;
    if (this.frames.elapsedFrames >= this.currentAnimation.frameBuffer) {
      this.frames.elapsedFrames = 0;
      if (this.frames.currentFrame < this.currentAnimation.framerate - 1) {
        this.frames.currentFrame++;
      } else {
        if (this.currentAnimation.loop) {
          this.frames.currentFrame = 0;
        } else {
          this.frames.currentFrame = this.currentAnimation.framerate - 1;
          this.currentAnimation.finished = true;

          // // Сброс флага атаки после завершения анимации
          // if (this.currentAnimation === this.animations.attackRight || this.currentAnimation === this.animations.attackLeft) {
          //     this.isAttacking = false;
          // }
        }
      }
    }
  }
  // switchAnimation(type) {
  //   if (this.currentAnimation.imageSrc === this.animations[type].imageSrc)
  //     return
  //   this.currentAnimation = this.animations[type]
  //   this.currentFrame = 0
  // }

  // attack() {
  //   const entity = physicManager.entityAtXY(
  //     this,
  //     this.position.x,
  //     this.position.y
  //   )
  //   if (entity && entity instanceof EnemyBase) {
  //     entity.onTouch(this) // Допустим, что у врага есть метод takeDamage()
  //   }
  // }

  // onTouch(obj) {
  //   if (obj instanceof EnemyBase) {
  //     this.switchAnimation(this.direction === 'right' ? 'hitRight' : 'hitLeft')
  //     this.lifetimes--
  //   }
  //   if (obj instanceof Bullet) {
  //     this.switchAnimation(this.direction === 'right' ? 'hitRight' : 'hitLeft')
  //     this.lifetimes--
  //   }

  //   if (obj instanceof Door) {
  //     if (eventManager.keys.spacePressed) {
  //       eventManager.preventInput = true
  //       eventManager.keys.spacePressed = false
  //       this.position.x = obj.position.x - 15
  //       this.switchAnimation('doorIn')
  //       gameManager.newLVL()
  //     }
  //   }

  //   if (obj instanceof Heal) {
  //     this.lifetimes++
  //     gameManager.score += 50
  //   }

  //   if (obj instanceof Coin) {
  //     gameManager.score += 200
  //   }

  //   if (this.lifetimes === 0) {
  //     gameManager.gameOver()
  //   }
  // }
}
