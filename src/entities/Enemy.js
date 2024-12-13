class Enemy extends Entity {
  constructor() {
    super();
    this.lives = 1;
    this.direction = "down";
    this.width = 43;
    this.height = 85;
    this.hitboxOffset = {xOffset: 0, yOffset: 0};
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };
    this.speed = 1;

    this.animations = {
      stayRight: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_right/Ghost_walk_right-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayLeft: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_left/Ghost_walk_left-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayUp: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_up/Ghost_walk_up-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayDown: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_down/Ghost_walk_down-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      walkLeft: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_left/Ghost_walk_left-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkRight: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_right/Ghost_walk_right-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkUp: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_up/Ghost_walk_up-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkDown: {
        imageSource:
            "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_down/Ghost_walk_down-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
    };
    this.isHitByPlayer = false;
    this.currentAnimation = this.animations.stayDown;
    this.lastTakeHitDate = null;
  }

  update() {
    const currentDate = Date.now();
    const diffDate = currentDate - this.lastTakeHitDate;
    if (diffDate > 2000) {
      this.isHitByPlayer = false;
    }

    if (!this.isHitByPlayer) {
      this.chaseFunction(this, gameManager.player);
    }

    physicManager.update(this);

    const entity = physicManager.entityAtXY(this);
    if (entity) {
      this.onTouch(entity);
    }

    const isMoving = this.velocity.x !== 0 || this.velocity.y !== 0;

    if (isMoving) {
      const animationType = "walk" + this.direction.charAt(0).toUpperCase() + this.direction.slice(1);
      this.switchAnimation(animationType);
    } else {
      const stayAnimation = "stay" + this.direction.charAt(0).toUpperCase() + this.direction.slice(1);
      this.switchAnimation(stayAnimation);
    }

    this.updateAnimation();
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  onTouch(entity) {
    if (entity instanceof Player) {
      entity.takeAttack(this);
    }
  }

  takeAttack(damage) {
    this.isHitByPlayer = true;
    this.lives -= damage;
    this.lastTakeHitDate = this.lastTakeHitDate ?? Date.now();

    if (this.lives <= 0) {
      gameManager.killEntity(this);
    }

    console.log('Current enemy', this);
  }
}
