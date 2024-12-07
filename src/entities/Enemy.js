class Enemy extends Entity {
  constructor() {
    super();
    this.lives = 2;
    this.direction = "down";
    this.width = 43;
    this.height = 85;
    this.hitboxOffset = { xOffset: 16, yOffset: 16 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };

    this.animations = {
      stayRight: {
        imageSource:
          "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_right/Ghost_walk_right-0",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayLeft: {
        imageSource:
          "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_left/Ghost_walk_left-0",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayUp: {
        imageSource:
          "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_up/Ghost_walk_up-0",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayDown: {
        imageSource:
          "tiles/Enemies/Ghost/WalkAnimations/Ghost_walk_down/Ghost_walk_down-0",
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
  }

  update() {
    if (!this.isHitByPlayer) {
      this.chaseFunction();
    }
    physicManager.update();
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

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  chaseFunction() {}

  // onTouch(entity) {
  //     if (entity instanceof Player) {
  //         this.lives--;
  //         if (this.lives <= 0) {
  //             this.wasEliminated();
  //         }
  //     }
  // }

  // wasEliminated() {
  //     gameManager.kill(this);
  // }

  updateAnimation() {
    this.frames.elapsedFrames++;
    if (this.frames.elapsedFrames >= this.currentAnimation.frameBuffer) {
      this.frames.elapsedFrames = 0;
      if (this.frames.currentFrame < this.currentAnimation.framerate - 1) {
        this.frames.currentFrame++;
      } else if (this.currentAnimation.loop) {
        this.frames.currentFrame = 0;
      } else {
        this.currentAnimation.finished = true;
      }
    }
  }
}
