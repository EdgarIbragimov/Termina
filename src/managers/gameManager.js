class GameManager {
  constructor() {
    this.factory = new Factory();

    this.factory.registerType("Player", Player);
    this.factory.registerType("Enemy", Enemy);
    this.factory.registerType("Needles", Needles);
    this.factory.registerType("Chest", Chest);
    this.factory.registerType("Trap", Trap);

    this.lastSpawnTime = Date.now();

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

    this.spawnPoints = [
      { name: "Ghost_spawn1", x: 117, y: 534 },
      { name: "Ghost_spawn2", x: 360, y: 811 },
      { name: "Ghost_spawn3", x: 1134, y: 56 },
    ];

    this.killCount = 0;
    this.maxKills = 12;

    this.bossIsKilled = false;
    this.gameMusicPath = "../../audio/music/ost.mp3";
  }

  initPlayer(obj) {
    this.player = obj;
  }

  update() {
    if (this.player === null) {
      return;
    }

    const currentDate = Date.now();
    const diffDate = currentDate - this.lastSpawnTime;
    if (diffDate > 8000) {
      this.spawnEnemies();
      this.lastSpawnTime = currentDate;
    }

    this.player.velocity = { x: 0, y: 0 };

    this.entities.forEach((e) => {
      try {
        e.update();
      } catch (error) {
        console.log("Game Error", error);
      }
    });

    this.player.updatePlayerHUD();

    mapManager.draw(ctx);
    this.draw(ctx);
  }

  spawnEnemies() {
    if (this.killCount >= this.maxKills || this.lvl === 2) {
      return;
    }

    this.spawnPoints.forEach((spawnPoint) => {
      const newEntity = this.factory.create("Enemy");
      Object.assign(newEntity, {
        name: spawnPoint.name,
        position: { x: spawnPoint.x, y: spawnPoint.y },
        width: 43,
        height: 85,
        sides: {
          bottom: spawnPoint.y + 85,
        },
      });

      this.entities.push(newEntity);
    });
  }

  killEntity(entity) {
    const entityIdForDelete = this.entities.indexOf(entity);
    if (entityIdForDelete > -1) {
      this.entities.splice(entityIdForDelete, 1);
      if (entity instanceof Enemy) {
        this.killCount++;
        this.player.updatePlayerHUD();
      }
    }
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
      "../../assets/sprites/spritesheet.png",
    );

    mapManager.parseEntities();
    mapManager.draw(ctx);
  }

  play(timestamp) {
    if (!this.gameOverFlag) {
      window.requestAnimationFrame((timestamp) => this.play(timestamp));

      if (!this.lastFrameTime) {
        this.lastFrameTime = timestamp;
      }

      const elapsed = timestamp - this.lastFrameTime;

      if (elapsed >= this.frameDuration) {
        updateWorld();
        this.lastFrameTime = timestamp - (elapsed % this.frameDuration);
      }
    }
  }

  gameOver() {
    this.gameOverFlag = true;
  }

  win() {
    this.gameOverFlag = true;
  }

  nextLevel() {
    this.lvl += 1;
    if (this.lvl > this.levels.length) {
      this.win();
    } else {
    }
  }

  init() {
    soundManager.init();
    soundManager.loadArray([this.gameMusicPath]);
    soundManager.setVolume(this.volume);
    soundManager.play(this.gameMusicPath, { looping: true });
  }
}

function updateWorld() {
  gameManager.update();
}

const gameManager = new GameManager();
