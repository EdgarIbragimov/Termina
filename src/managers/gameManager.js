class GameManager {
  constructor() {
    this.factory = new Factory();

    this.factory.registerType("Player", Player);
    this.factory.registerType("Enemy", Enemy);
    this.factory.registerType("Needles", Needles);
    this.factory.registerType("Chest", Chest);
    this.factory.registerType("Trap", Trap);
    this.factory.registerType("Transition", Transition);

    this.entities = [];
    this.player = null;
    this.lvl = 1;
    this.levels = [
      "../../assets/map/Level1.json",
      "../../assets/map/Level2.json",
    ];
    this.killCount = 0;
    this.maxKills = 6;
    this.isBossLevel = false;

    this.frameDuration = 1000 / 60;
    this.lastFrameTime = 0;
    this.lastSpawnTime = Date.now();
    this.startGameTime = null;
    this.finishGameTime = null;

    this.gameOverFlag = false;

    this.volume = 1;
    this.gameMusicPath = "../../audio/music/ost.mp3";
    this.needlesEventPath = "../../audio/sounds/needles_event1.wav";
    this.needlesLaughPath = "../../audio/sounds/needles_laugh.wav";
    this.trapSoundPath = "../../audio/sounds/trap_sound.wav";
    this.deathSoundPath = "../../audio/sounds/death_sound.wav";
    this.attackSoundPath = "../../audio/sounds/attack_sound.wav";
    this.chestSoundPath = "../../audio/sounds/chest_sound.wav";

    this.spawnPoints = [
      { name: "Ghost_spawn1", x: 117, y: 534 },
      { name: "Ghost_spawn2", x: 360, y: 811 },
      { name: "Ghost_spawn3", x: 1134, y: 56 },
    ];
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
    this.updateLevelObjective();
  }

  initSound() {
    if (!soundManager.loaded) {
      soundManager.init();
      soundManager.loadArray([
        this.gameMusicPath,
        this.needlesEventPath,
        this.trapSoundPath,
        this.deathSoundPath,
        this.attackSoundPath,
        this.chestSoundPath,
        this.needlesLaughPath,
      ]);
    }

    const startAudio = () => {
      if (soundManager.context.state === "suspended") {
        soundManager.context.resume().then(() => {
         soundManager.play(this.gameMusicPath, { looping: true });
        });
      }
    };

    document.addEventListener("click", startAudio, { once: true });
    document.addEventListener("keydown", startAudio, { once: true });
  }

  initPlayer(obj) {
    this.player = obj;
  }

  play(timestamp) {
    if (!this.gameOverFlag) {
      if (this.startGameTime === null) {
        this.startGameTime = Date.now();
      }
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

  update() {
    if (!this.player) return;

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

    if (this.player) {
      this.updatePlayerHUD();
    }

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

  spawnEnemies() {
    if (this.killCount >= this.maxKills || this.lvl === 2) return;
  
    this.spawnPoints.forEach((spawnPoint) => {
      const newEntity = this.factory.create("Enemy");
      Object.assign(newEntity, {
        name: spawnPoint.name,
        position: { x: spawnPoint.x, y: spawnPoint.y },
        width: 43,
        height: 85,
        sides: { bottom: spawnPoint.y + 85 },
      });
      this.entities.push(newEntity);
    });
  }

  killEntity(entity) {
    const entityIdForDelete = this.entities.indexOf(entity);
    if (entityIdForDelete > -1) {
      this.entities.splice(entityIdForDelete, 1);
      if (entity instanceof Enemy) {
        if (this.lvl === 1) {
          this.killCount++;
        }
        this.updatePlayerHUD();
      }
    }
  }

  nextLevel() {
    this.lvl += 1;

    const playerState = {
      lives: this.player.lives,
      damage: this.player.damage,
      speed: this.player.speed,
      hasBeenTrapped: this.player.hasBeenTrapped,
      isSpeedDebuffed: this.player.isSpeedDebuffed,
      defaultSpeed: this.player.defaultSpeed,
    };

    this.entities = [];
    this.killCount = 0;
    this.isBossLevel = this.lvl === 2;

    mapManager.reset();
    this.loadAll(ctx, this.lvl);

    setTimeout(() => {
      if (this.player) {
        Object.assign(this.player, playerState);
        this.updatePlayerHUD();
        this.updateLevelObjective();
      }
    }, 100);
  }

  updatePlayerHUD() {
    document.getElementById("lives").textContent = this.player.lives;
    document.getElementById("damage").textContent = this.player.damage;
    document.getElementById("speed").textContent = this.player.speed;
    document.getElementById("kills").textContent = this.killCount;
  }

  updateLevelObjective() {
    const killsElement = document.getElementById("kills");
    const maxKillsElement = document.getElementById("maxKills");
    const killsLabel = document.querySelector("#info p:last-child strong");

    if (this.isBossLevel) {
      killsLabel.textContent = "Objective:";
      killsElement.style.display = "none";
      maxKillsElement.textContent = "KILL THE BOSS!";
      maxKillsElement.style.color = "red";
    }
  }

  displayMessage(message) {
    if (!message) return;

    const existingContainer = document.querySelector(".message-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    const messageContainer = document.createElement("div");
    messageContainer.className = "message-container";
    document.body.appendChild(messageContainer);

    setTimeout(() => {
      messageContainer.classList.add("visible");
    }, 10);

    let currentText = "";
    const typeSpeed = 50;

    const typeWriter = (text, index) => {
      if (index < text.length) {
        currentText += text[index];
        messageContainer.textContent = currentText;
        setTimeout(() => typeWriter(text, index + 1), typeSpeed);
      }
    };

    typeWriter(message.toString(), 0);

    setTimeout(
      () => {
        messageContainer.classList.add("fade-out");
        setTimeout(() => {
          messageContainer.remove();
        }, 500);
      },
      message.toString().length * typeSpeed + 2000,
    );
  }

  handleGameWin() {
    if (!this.gameOverFlag) {
      this.gameOverFlag = true;
      this.finishGameTime = Date.now();
      const gameTime = Math.round(
        (this.finishGameTime - this.startGameTime) / 1000,
      );

      const playerNickname =
        localStorage.getItem("playerNickname") || "Unknown";

      const leaderboardData = JSON.parse(
        localStorage.getItem("leaderboard") || "[]",
      );
      leaderboardData.push({
        nickname: playerNickname,
        time: gameTime,
        date: new Date().toISOString(),
      });

      leaderboardData.sort((a, b) => a.time - b.time);
      if (leaderboardData.length > 10) {
        leaderboardData.length = 10;
      }

      localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));

      this.displayMessage(
        `Congratulations! You've completed the game in ${gameTime} seconds! Press SPACE or Enter to view leaderboard`,
      );

      const onKeyPress = (event) => {
        if (event.key === " " || event.key === "Enter") {
          soundManager.stopAll();
          window.location.href = "../../src/html/leaderboard.html";
        }
      };

      document.addEventListener("keydown", onKeyPress);
      this.cleanupGameWinListeners = () => {
        document.removeEventListener("keydown", onKeyPress);
      };
    }
  }

  gameOver() {
    if (this.player) {
      soundManager.play(this.deathSoundPath);
      setTimeout(() => {
        this.gameOverFlag = true;
        this.finishGameTime = Date.now();
        const gameTime = Math.round(
          (this.finishGameTime - this.startGameTime) / 1000,
        );

        this.displayMessage(
          "Game Over! Press SPACE or Enter for return to main menu",
        );

        const onKeyPress = (event) => {
          if (event.key === " " || event.key === "Enter") {
            soundManager.stopAll();
            window.location.href = "../../src/html/menu.html";
          }
        };

        document.addEventListener("keydown", onKeyPress);
        this.cleanupGameOverListeners = () => {
          document.removeEventListener("keydown", onKeyPress);
        };
      }, 2000);
    }
  }
}

function updateWorld() {
  gameManager.update();
}

const gameManager = new GameManager();
