class Player extends Entity {
  constructor() {
    super();

    this.lifetimes = 3;
    this.direction = "down";
    this.speed = 2;
    this.isAttacking = false;
    this.attackCD = 1000;
    this.attackEnd = 0;
    this.width = 43;
    this.height = 105;
    this.hitboxOffset = { xOffset: 16, yOffset: 16 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };

    this.isAttacking = false;

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
      death: {
        imageSource: "tiles/Player/DeathAnimations/Player_death/Player_death-",
        framerate: 2,
        frameBuffer: 60,
        loop: false,
      },
      crawl: {
        imageSource: "tiles/Player/CrawlAnimations/Player_crawl_",
        framerate: 3,
        frameBuffer: 12,
        loop: true,
      },
      defaultAnimation: {
        imageSource: "tiles/Player/DefaultAnimations/Player_stay_down.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      walkDownLeft: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_diag/DownLeft/DownLeft",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkDownRight: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_diag/DownRight/DownRight",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkUpLeft: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_diag/UpLeft/UpLeft",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkUpRight: {
        imageSource:
          "tiles/Player/WalkAnimations/Player_walk_diag/UpRight/UpRight",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      attackLeft: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_left/Player_attack_left-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackRight: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_right/Player_attack_right-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackDown: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_down/Player_attack_down-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackUp: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_up/Player_attack_up-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackUpLeft: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_up_left/Player_attack_up_left-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackUpRight: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_up_right/Player_attack_up_right-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackDownLeft: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_down_left/Player_attack_down_left-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
      attackDownRight: {
        imageSource:
          "tiles/Player/AttackAnimations/Player_attack_down_right/Player_attack_down_right-",
        framerate: 3,
        frameBuffer: 9,
        loop: false,
      },
    };

    this.currentAnimation = this.animations.stayDown;
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  update() {
    if (!this.isAttacking) {
      if (eventsManager.keys["d"].pressed && eventsManager.keys["s"].pressed) {
        this.moveDownRight();
      } else if (
        eventsManager.keys["a"].pressed &&
        eventsManager.keys["s"].pressed
      ) {
        this.moveDownLeft();
      } else if (
        eventsManager.keys["a"].pressed &&
        eventsManager.keys["w"].pressed
      ) {
        this.moveUpLeft();
      } else if (
        eventsManager.keys["d"].pressed &&
        eventsManager.keys["w"].pressed
      ) {
        this.moveUpRight();
      } else {
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
      }
    } else {
      this.velocity = { x: 0, y: 0 };
    }

    if (eventsManager.keys[" "].pressed) {
      this.attack();
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
            : this.direction === "downLeft"
            ? "walkDownLeft"
            : this.direction === "upLeft"
            ? "walkUpLeft"
            : this.direction === "downRight"
            ? "walkDownRight"
            : this.direction === "upRight"
            ? "walkUpRight"
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

  attack() {
    const currentTime = Date.now();
    if (currentTime - this.attackEnd >= this.attackCD && !this.isAttacking) {
      this.attackEnd = currentTime;
      this.isAttacking = true;
      this.isAttacking = true;
      this.switchAnimation(
        this.direction === "down"
          ? "attackDown"
          : this.direction === "up"
          ? "attackUp"
          : this.direction === "left"
          ? "attackLeft"
          : this.direction === "right"
          ? "attackRight"
          : this.direction === "downLeft"
          ? "attackDownLeft"
          : this.direction === "upLeft"
          ? "attackUpLeft"
          : this.direction === "downRight"
          ? "attackDownRight"
          : this.direction === "upRight"
          ? "attackUpRight"
          : "defaultAnimation"
      );

      const entities = gameManager.entities;
      for (let entity of entities) {
        if (
          entity instanceof Enemy &&
          physicManager.checkCollision(this.hitbox, entity.hitbox)
        ) {
          entity.onTouch(this);
        }
      }
    }
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

          if (
            this.currentAnimation === this.animations.attackRight ||
            this.currentAnimation === this.animations.attackLeft ||
            this.currentAnimation === this.animations.attackDown ||
            this.currentAnimation === this.animations.attackUp ||
            this.currentAnimation === this.animations.attackDownLeft ||
            this.currentAnimation === this.animations.attackDownRight ||
            this.currentAnimation === this.animations.attackUpLeft ||
            this.currentAnimation === this.animations.attackUpRight
          ) {
            this.isAttacking = false;
          }
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

  moveDownLeft() {
    this.velocity.x = -this.speed;
    this.velocity.y = this.speed;
    this.direction = "downLeft";
    this.switchAnimation("walkDownLeft");
  }

  moveDownRight() {
    this.velocity.x = this.speed;
    this.velocity.y = this.speed;
    this.direction = "downRight";
    this.switchAnimation("walkDownRight");
  }

  moveUpLeft() {
    this.velocity.x = -this.speed;
    this.velocity.y = -this.speed;
    this.direction = "upLeft";
    this.switchAnimation("walkUpLeft");
  }

  moveUpRight() {
    this.velocity.x = this.speed;
    this.velocity.y = -this.speed;
    this.direction = "upRight";
    this.switchAnimation("walkUpRight");
  }

  onTouch(object) {
    if (object instanceof Additional) {
      object.isActivated = true;
      this.applyDebuff();
    }
  }

  applyDebuff() {
    this.speed *= 0.5;
  }
}
