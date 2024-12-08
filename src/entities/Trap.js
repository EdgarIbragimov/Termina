class Trap extends Entity {
  constructor() {
    super();
    this.width = 55;
    this.height = 54;
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

    this.animations = {
      trapDefault: {
        imageSource:
          "tiles/Objects/Traps/BeartrapAnimation/BeartrapAnimation-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      trapAnimation: {
        imageSource: "tiles/Objects/Traps/BeartrapAnimation/BeartrapAnimation-",
        framerate: 2,
        frameBuffer: 6,
        loop: false,
      },
    };
    this.currentAnimation = this.animations.trapDefault;

    this.isActivate = false;
    this.isVisible = true;
  }

  update() {
    this.hitbox.position.x = this.position.x + this.hitboxOffset.xOffset;
    this.hitbox.position.y = this.position.y + this.hitboxOffset.yOffset;
    this.updateAnimation();
  }

  draw() {
    if (this.isVisible) {
      spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
    }
  }
}
