class GameManager {
  constructor() {
    this.factory = new Factory();
    //this.sounds = new SoundManager();
    // Регистрация типов объектов и карты
    this.factory.registerType("Player", Player);
    this.factory.registerType("Enemy", Enemy);
    this.factory.registerType("Needles", Needles);
    this.factory.registerType("Chest", Chest);
    this.factory.registerType("Trap", Trap);

    this.entities = [];
    this.player = null;
    this.lvl = 1;
    this.levels = [
      "../../assets/map/Level1.json",
      "../../assets/map/Level2.json",
    ];
    this.frameDuration = 1000 / 60;
    this.lastFrameTime = 0;

    this.volume = 1;
  }

  initPlayer(obj) {
    this.player = obj;
  }

  update() {
    if (this.player === null) {
      return;
    }

    this.player.velocity.x = 0;

    this.entities.forEach((e) => {
      try {
        e.update();
      } catch (error) {
        console.log("Game Error", error);
      }
    });

    mapManager.draw(ctx);
    this.draw(ctx);
  }

  draw(ctx) {
    this.entities.forEach((e) => {
      try {
        e.draw(ctx);
      } catch (error) {
        console.log("Draw error", error);
      }
    });
  }

  loadAll(ctx, lvl) {
    this.lvl = lvl;
    mapManager.loadMap(this.levels[this.lvl - 1]);
    spriteManager.loadAtlas(
      "../../assets/sprites/atlas.json",
      "../../assets/sprites/spritesheet.png"
    );

    mapManager.parseEntities();
    mapManager.draw(ctx);
  }

  play(timestamp) {
    window.requestAnimationFrame((timestamp) => this.play(timestamp));
    //ИЗМЕНИЛ
    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp;
    }

    const elapsed = timestamp - this.lastFrameTime;

    if (elapsed >= this.frameDuration) {
      updateWorld();
      this.lastFrameTime = timestamp - (elapsed % this.frameDuration); // Избегаем накопления ошибок времени
    }
  }

  // init() {
  //   this.sounds.init();
  //   this.sounds.loadArray([this.sounds.gameMusicPath]);
  //   this.sounds.setVolume(this.volume);
  // }

}

function updateWorld() {
  gameManager.update();
}

const gameManager = new GameManager();
