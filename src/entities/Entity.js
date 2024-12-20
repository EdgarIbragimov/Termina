class Entity {
  constructor(pos_x = 0, pos_y = 0, size_x = 0, size_y = 0) {
    this.position = { x: pos_x, y: pos_y };
    this.width = size_x;
    this.height = size_y;

    this.velocity = { x: 0, y: 0 };
    this.hitboxOffset = { xOffset: 0, yOffset: 0 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };

    this.currentAnimation = null;
    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0,
    };
  }

  update() {}

  onTouch() {}

  draw(ctx) {
    if (this.currentAnimation) {
      spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
    }
  }

  switchAnimation(type) {
    if (
      this.currentAnimation &&
      this.currentAnimation.imageSource === this.animations[type].imageSource
    )
      return;
    this.currentAnimation = this.animations[type];
    this.frames.currentFrame = 0;
    this.frames.elapsedFrames = 0;
  }

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

  chaseFunction(enemy, player) {
    if (!enemy || !player) {
      return;
    }

    const dx = player.hitbox.position.x - enemy.hitbox.position.x;
    const dy = player.hitbox.position.y - enemy.hitbox.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const STOP_THRESHOLD = 3;

    if (distance > STOP_THRESHOLD) {
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;

      enemy.velocity.x = normalizedX * this.speed;
      enemy.velocity.y = normalizedY * this.speed;

      enemy.position.x += enemy.velocity.x;
      enemy.position.y += enemy.velocity.y;
      
      if (Math.abs(enemy.velocity.x) > Math.abs(enemy.velocity.y)) {
        enemy.direction = enemy.velocity.x > 0 ? "right" : "left";
      } else {
        enemy.direction = enemy.velocity.y > 0 ? "down" : "up";
      }
    } else {
      enemy.velocity.x = 0;
      enemy.velocity.y = 0;
    }
  }
}
