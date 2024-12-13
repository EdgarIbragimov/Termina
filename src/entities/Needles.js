class Needles extends Entity {
  constructor() {
    super();
    this.lives = 4;
    this.direction = "down";
    this.width = 61;
    this.height = 107;
    this.hitboxOffset = { xOffset: 0, yOffset: 0 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };
    this.speed = 3;

    this.isTrapped = false;

    this.isHitByPlayer = false;
    this.lastTakeHitDate = null;

    //this.isDead = false;

    this.animations = {
      stayRight: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_right/Needles_walk_right-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayLeft: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_left/Needles_walk_left-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayUp: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_up/Needles_walk_up-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayDown: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_down/Needles_walk_down-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      walkLeft: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_left/Needles_walk_left-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkRight: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_right/Needles_walk_right-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkUp: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_up/Needles_walk_up-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkDown: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_down/Needles_walk_down-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      inTrap: {
        imageSource:
          "tiles/Enemies/Needles/TrapAnimations/Needles_trap/Needles_trap-",
        framerate: 8,
        frameBuffer: 24,
        loop: false,
      },
      death: {
        imageSource: "tiles/Enemies/Needles/DeathAnimations/Needles_death.png",
        framerate: 1,
        frameBuffer: 60,
        loop: true,
      },
    };

    this.currentAnimation = this.animations.stayDown;
  }

  update() {
    if (this.isDead) return;

    const currentDate = Date.now();
    const diffDate = currentDate - this.lastTakeHitDate;
    if (diffDate > 1000) {
      this.isHitByPlayer = false;
    }

    if (!this.isHitByPlayer) {
      this.chaseFunction(this, gameManager.player);
    }

    physicManager.update(this);

    const isMoving =
      Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.y) > 0.01;

    if (!this.isTrapped) {
      if (isMoving) {
        const animationType =
          "walk" +
          this.direction.charAt(0).toUpperCase() +
          this.direction.slice(1);
        this.switchAnimation(animationType);
      } else {
        const stayAnimation =
          "stay" +
          this.direction.charAt(0).toUpperCase() +
          this.direction.slice(1);
        this.switchAnimation(stayAnimation);
      }
    }

    const entity = physicManager.entityAtXY(this);
    if (entity) {
      this.onTouch(entity);
    }

    this.updateAnimation();
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  onTouch(entity) {
    if (entity instanceof Trap && !entity.isActivate) {
      const enemyFeetY = this.hitbox.position.y + this.hitbox.height;
      const trapTopY = entity.hitbox.position.y;
      const trapBottomY = entity.hitbox.position.y + entity.hitbox.height;

      if (enemyFeetY > trapTopY && enemyFeetY <= trapBottomY) {
        this.lives--;
        entity.isActivate = true;
        entity.switchAnimation("trapAnimation");
        if (this.lives <= 0) {
          this.kill();
        } else {
          this.isTrapped = true;
          console.log("Trap activated by enemy");
          this.speed = 0;
          this.switchAnimation("inTrap");

          entity.isVisible = false;

          setTimeout(() => {
            this.speed = 3;
            this.isTrapped = false;
            entity.isVisible = true;
          }, 3000);
        }
      }
    }

    if (entity instanceof Player && !this.isTrapped) {
      entity.takeAttack(this);
    }
  }

  takeAttack(damage) {
    this.isHitByPlayer = true;
    this.lives -= damage;
    this.lastTakeHitDate = this.lastTakeHitDate ?? Date.now();
    console.log("Current enemy", this.lives, this);
    if (this.lives <= 0) {
      this.kill();
    }
  }

  kill() {
    this.isDead = true;
    this.switchAnimation("death");
    gameManager.bossIsKilled = true;
  }
}
