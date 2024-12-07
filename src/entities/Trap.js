class Trap extends Entity {
  constructor(pos_x, pos_y) {
    super(pos_x, pos_y, 55, 54);
    this.hitboxOffset = { xOffset: 0, yOffset: 0 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };

    this.animations = {
      trapAnimation: {
        imageSource: "tiles/Objects/Traps/BeartrapAnimation/BeartrapAnimation-",
        framerate: 2,
        frameBuffer: 12,
        loop: true,
      },
    };
    this.currentAnimation = this.animations.trapAnimation;
    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0,
    };
  }

  update() {
    this.updateAnimation();
  }
}
