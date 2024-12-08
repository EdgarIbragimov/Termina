class Chest extends Entity {
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
      chestDefault: {
        imageSource: "tiles/Objects/Chest/ChestAnimation/ChestAnimation-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      chestAnimation: {
        imageSource: "tiles/Objects/Chest/ChestAnimation/ChestAnimation-",
        framerate: 2,
        frameBuffer: 6,
        loop: false,
      },
    };

    this.currentAnimation = this.animations.chestDefault;
    this.isOpen = false;
  }

  update() {
    this.updateAnimation();
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.switchAnimation("chestAnimation");
    }
  }
}
