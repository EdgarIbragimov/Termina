class SpriteManager {
  constructor() {
    this.image = new Image();
    this.sprites = [];
    this.imgLoaded = false;
    this.jsonLoaded = false;
  }

  loadAtlas(atlasJson, atlasImg) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.parseAtlas(request.responseText);
      }
    };
    request.open("GET", atlasJson, true);
    request.send();
    this.loadImg(atlasImg);
  }

  loadImg(imgName) {
    this.image.onload = () => {
      this.imgLoaded = true;
    };
    this.image.src = imgName;
  }

  parseAtlas(atlasJSON) {
    const atlas = JSON.parse(atlasJSON);
    for (let key in atlas.frames) {
      const frame = atlas.frames[key].frame;
      this.sprites.push({
        filename: key,
        x: frame.x,
        y: frame.y,
        w: frame.w,
        h: frame.h,
      });
    }
    this.jsonLoaded = true;
  }

  drawSprite(ctx, obj, x, y) {
    if (!this.imgLoaded || !this.jsonLoaded) {
      setTimeout(() => this.drawSprite(ctx, obj, x, y), 100);
      return;
    }

    let spriteName = obj.currentAnimation.imageSource;

    if (obj.currentAnimation.framerate > 1) {
      spriteName = `${spriteName}${obj.frames.currentFrame}.png`;
    }

    const sprite = this.getSprite(spriteName);
    if (sprite) {
      ctx.drawImage(
        this.image,
        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h,
        x,
        y,
        sprite.w,
        sprite.h,
      );
    } else {
      console.warn(`Sprite not found: ${spriteName}`);
    }
  }

  getSprite(name) {
    return this.sprites.find((s) => s.filename === name) || null;
  }
}

const spriteManager = new SpriteManager();
