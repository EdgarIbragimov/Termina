class Player extends Entity {
  constructor() {
    super();

    this.lives = 3;
    this.direction = "down";
    this.speed = 6;
    this.isAttacking = false;
    this.attackCD = 1000;
    this.attackEnd = 0;
    this.width = 43;
    this.height = 105;
    this.hitboxOffset = {
      xOffset: 0,
      yOffset: 0,
    };
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
      stayCrawlLeft: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_left/Player_crawl_left-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      stayCrawlRight: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_right/Player_crawl_right-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      stayCrawlUp: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_up/Player_crawl_up-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
      stayCrawlDown: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_down/Player_crawl_down-0.png",
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
      crawlLeft: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_left/Player_crawl_left-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlRight: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_right/Player_crawl_right-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlUp: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_up/Player_crawl_up-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlDown: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_down/Player_crawl_down-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlDownLeft: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_diag/DownLeft/DownLeft",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlDownRight: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_diag/DownRight/DownRight",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlUpLeft: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_diag/UpLeft/UpLeft",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      crawlUpRight: {
        imageSource:
          "tiles/Player/CrawlAnimations/Player_crawl_diag/UpRight/UpRight",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
    };

    this.currentAnimation = this.animations.stayDown;

    this.isSpeedDebuffed = false;
    this.hasBeenTrapped = false;
    this.isInvulnerable = false;
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

    const entity = physicManager.entityAtXY(this);
    if (entity) {
      this.onTouch(entity);
    }

    this.updateAnimation();

    if (this.currentAnimation.finished) {
      this.currentAnimation.finished = false;
      this.frames.currentFrame = 0;

      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        this.switchAnimation(
          this.direction === "down"
            ? this.hasBeenTrapped
              ? "crawlDown"
              : "walkDown"
            : this.direction === "up"
            ? this.hasBeenTrapped
              ? "crawlUp"
              : "walkUp"
            : this.direction === "left"
            ? this.hasBeenTrapped
              ? "crawlLeft"
              : "walkLeft"
            : this.direction === "right"
            ? this.hasBeenTrapped
              ? "crawlRight"
              : "walkRight"
            : this.direction === "downLeft"
            ? this.hasBeenTrapped
              ? "crawlDownLeft"
              : "walkDownLeft"
            : this.direction === "upLeft"
            ? this.hasBeenTrapped
              ? "crawlUpLeft"
              : "walkUpLeft"
            : this.direction === "downRight"
            ? this.hasBeenTrapped
              ? "crawlDownRight"
              : "walkDownRight"
            : this.direction === "upRight"
            ? this.hasBeenTrapped
              ? "crawlUpRight"
              : "walkUpRight"
            : "defaultAnimation"
        );
      } else {
        this.switchAnimation(
          this.direction === "down"
            ? this.hasBeenTrapped
              ? "stayCrawlDown"
              : "stayDown"
            : this.direction === "up"
            ? this.hasBeenTrapped
              ? "stayCrawlUp"
              : "stayUp"
            : this.direction === "left"
            ? this.hasBeenTrapped
              ? "stayCrawlLeft"
              : "stayLeft"
            : this.direction === "right"
            ? this.hasBeenTrapped
              ? "stayCrawlRight"
              : "stayRight"
            : this.hasBeenTrapped
            ? "stayCrawlDown"
            : "defaultAnimation"
        );
      }
    }
  }

  onTouch(entity) {
    if (entity instanceof Trap && !entity.isActivate) {
      const playerFeetY = this.hitbox.position.y + this.hitbox.height;
      const trapTopY = entity.hitbox.position.y;
      const trapBottomY = entity.hitbox.position.y + entity.hitbox.height;

      if (playerFeetY > trapTopY && playerFeetY <= trapBottomY) {
        this.lives--;
        console.log("Player lives: ", this.lives);
        if (!this.isSpeedDebuffed) {
          this.speed *= 0.5;
          this.isSpeedDebuffed = true;
        }
        entity.isActivate = true;
        entity.switchAnimation("trapAnimation");

        if (!this.hasBeenTrapped) {
          this.hasBeenTrapped = true;
        }
      }
    }
  }

  attack() {
    if (this.hasBeenTrapped) {
      console.log("Player cannot attack after being trapped.");
      return;
    }
    const currentTime = Date.now();
    if (currentTime - this.attackEnd >= this.attackCD && !this.isAttacking) {
      this.attackEnd = currentTime;
      this.isAttacking = true;
      this.isInvulnerable = true;
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

      // Обновление размера хитбокса в зависимости от направлеия удара
      // if (this.direction === "down") {
      //   this.hitbox.position.y += 10;
      // }
      // if (this.direction === "down") {
      //   this.hitbox.position.y += 10;
      // }

      // const entities = gameManager.entities;
      // for (let entity of entities) {
      //   if (
      //     entity instanceof Enemy &&
      //     physicManager.checkCollision(this.hitbox, entity.hitbox)
      //   ) {
      //     entity.onTouch(this);
      //   }
      // }
      const entity = physicManager.entityAtXY(this);
      if (entity && entity instanceof Enemy) {
        entity.takeAttack();
      }
    }
  }

  moveLeft() {
    this.velocity.x = -this.speed;
    this.direction = "left";
    this.switchAnimation(this.hasBeenTrapped ? "crawlLeft" : "walkLeft");
  }

  moveRight() {
    this.velocity.x = this.speed;
    this.direction = "right";
    this.switchAnimation(this.hasBeenTrapped ? "crawlRight" : "walkRight");
  }

  moveUp() {
    this.velocity.y = -this.speed;
    this.direction = "up";
    this.switchAnimation(this.hasBeenTrapped ? "crawlUp" : "walkUp");
  }

  moveDown() {
    this.velocity.y = this.speed;
    this.direction = "down";
    this.switchAnimation(this.hasBeenTrapped ? "crawlDown" : "walkDown");
  }

  stopMoving() {
    this.velocity = { x: 0, y: 0 };
    this.switchAnimation(
      this.direction === "down"
        ? this.hasBeenTrapped
          ? "stayCrawlDown"
          : "stayDown"
        : this.direction === "up"
        ? this.hasBeenTrapped
          ? "stayCrawlUp"
          : "stayUp"
        : this.direction === "left"
        ? this.hasBeenTrapped
          ? "stayCrawlLeft"
          : "stayLeft"
        : this.direction === "right"
        ? this.hasBeenTrapped
          ? "stayCrawlRight"
          : "stayRight"
        : this.hasBeenTrapped
        ? "stayCrawlDown"
        : "defaultAnimation"
    );
  }

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

  moveDownLeft() {
    this.velocity.x = -this.speed;
    this.velocity.y = this.speed;
    this.direction = "downLeft";
    this.switchAnimation(
      this.hasBeenTrapped ? "crawlDownLeft" : "walkDownLeft"
    );
  }

  moveDownRight() {
    this.velocity.x = this.speed;
    this.velocity.y = this.speed;
    this.direction = "downRight";
    this.switchAnimation(
      this.hasBeenTrapped ? "crawlDownRight" : "walkDownRight"
    );
  }

  moveUpLeft() {
    this.velocity.x = -this.speed;
    this.velocity.y = -this.speed;
    this.direction = "upLeft";
    this.switchAnimation(this.hasBeenTrapped ? "crawlUpLeft" : "walkUpLeft");
  }

  moveUpRight() {
    this.velocity.x = this.speed;
    this.velocity.y = -this.speed;
    this.direction = "upRight";
    this.switchAnimation(this.hasBeenTrapped ? "crawlUpRight" : "walkUpRight");
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
            this.isInvulnerable = false;
          }
        }
      }
    }
  }
}
