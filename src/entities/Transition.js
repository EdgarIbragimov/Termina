class Transition extends Entity {
  constructor() {
    super();

    this.width = 50.5868069607448;
    this.height = 298.462161068393;
    this.hitboxOffset = { xOffset: 0, yOffset: 0 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };
  }

  update() {
    this.hitbox.position.x = this.position.x + this.hitboxOffset.xOffset;
    this.hitbox.position.y = this.position.y + this.hitboxOffset.yOffset;
  }
}
