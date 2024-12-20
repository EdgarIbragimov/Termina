class MapManager {
  constructor() {
    this.mapData = null;
    this.tLayer = null;
    this.xCount = 0;
    this.yCount = 0;
    this.tSize = { x: 16, y: 16 };
    this.mapSize = { x: 16, y: 10 };
    this.tilesets = [];
    this.imgLoadCount = 0;
    this.jsonLoaded = false;
  }

  reset() {
    this.mapData = null;
    this.tLayer = null;
    this.xCount = 0;
    this.yCount = 0;
    this.tSize = { x: 16, y: 16 };
    this.mapSize = { x: 0, y: 0 };
    this.tilesets = [];
    this.imgLoadCount = 0;
    this.imgLoaded = false;
    this.jsonLoaded = false;
  }

  parseMap(tilesJSON) {
    this.mapData = JSON.parse(tilesJSON);
    this.xCount = this.mapData.width;
    this.yCount = this.mapData.height;
    this.tSize.x = this.mapData.tilewidth;
    this.tSize.y = this.mapData.tileheight;
    this.mapSize.x = this.xCount * this.tSize.x;
    this.mapSize.y = this.yCount * this.tSize.y;

    const onLoadImage = () => {
      this.imgLoadCount++;
      if (this.imgLoadCount === this.mapData.tilesets.length) {
        this.imgLoaded = true;
      }
    };

    this.mapData.tilesets.forEach((t) => {
      const img = new Image();
      img.onload = onLoadImage;
      img.src = t.image;

      const ts = {
        firstgid: t.firstgid,
        image: img,
        name: t.name,
        xCount: Math.floor(t.imagewidth / this.tSize.x),
        yCount: Math.floor(t.imageheight / this.tSize.y),
      };

      this.tilesets.push(ts);
    });

    this.jsonLoaded = true;
  };

  draw(ctx) {
    if (!this.imgLoaded || !this.jsonLoaded) {
      setTimeout(() => this.draw(ctx), 100);
    } else {
      if (this.tLayer === null) {
        this.tLayer = this.mapData.layers.filter(
          (layer) => layer.type === "tilelayer",
        );
      }
      this.tLayer.forEach((layer) => {
        layer.data.forEach((tileIndex, i) => {
          if (tileIndex !== 0) {
            const tile = this.getTile(tileIndex);
            const pX = (i % this.xCount) * this.tSize.x;
            const pY = Math.floor(i / this.xCount) * this.tSize.y;
            ctx.drawImage(
              tile.img, // Изображение
              tile.px, // Координата х в изображении
              tile.py, // Координата y в изображении
              this.tSize.x, // Ширина блока в изображении
              this.tSize.y, // Высота блока в изображении
              pX, // Координата x где необходимо изобразить блок
              pY, // Координата y где необходимо изобразить
              this.tSize.x, // Размеры отображаемого блока
              this.tSize.y, // Размеры отображаемого блока
            );
          }
        });
      });
    }
  };

  getTile(tileIndex) {
    const tile = {
      img: null,
      px: 0,
      py: 0,
    };
    const tileset = this.getTileset(tileIndex);
    tile.img = tileset.image;
    const id = tileIndex - tileset.firstgid;
    const x = id % tileset.xCount;
    const y = Math.floor(id / tileset.xCount);
    tile.px = x * this.tSize.x;
    tile.py = y * this.tSize.y;
    return tile;
  };

  getTileset(tileIndex) {
    for (let i = this.tilesets.length - 1; i >= 0; i--) {
      if (this.tilesets[i].firstgid <= tileIndex) {
        return this.tilesets[i];
      }
    }
    return null;
  };

  loadMap(path) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.parseMap(request.responseText);
      }
    };
    request.open("GET", path, true);
    request.send();
  };

  parseEntities() {
    if (!this.imgLoaded || !this.jsonLoaded) {
      setTimeout(() => this.parseEntities(), 100);
    } else {
      this.mapData.layers.forEach((layer) => {
        if (layer.type === "objectgroup") {
          const entities = layer.objects;
          entities.forEach((e) => {
            try {
              const obj = gameManager.factory.create(e.type);
              obj.name = e.name;
              obj.position = { x: e.x, y: e.y };
              obj.width = e.width;
              obj.height = e.height;
              obj.sides = { bottom: obj.position.y + obj.height };
              gameManager.entities.push(obj);

              if (obj.name === "Player") {
                gameManager.initPlayer(obj);
              }
            } catch (ex) {
              console.log(`Error while creating: [${e.gid}] ${e.type}, ${ex}`);
            }
          });
        }
      });
    }
  };

  getTilesetIdxOnWalkingArea(x, y) {
    const idx =
      Math.floor(y / this.tSize.y) * this.xCount + Math.floor(x / this.tSize.x);
    return this.tLayer.find((layer) => layer.name === "WalkArea").data[idx];
  };
}

const mapManager = new MapManager();
