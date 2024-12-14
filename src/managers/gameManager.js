class GameManager {
  constructor() {
    this.factory = new Factory();

    this.factory.registerType("Player", Player);
    this.factory.registerType("Enemy", Enemy);
    this.factory.registerType("Needles", Needles);
    this.factory.registerType("Chest", Chest);
    this.factory.registerType("Trap", Trap);
    this.factory.registerType("Transition", Transition);

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
    this.maxKills = 6;

    this.isBossLevel = false;
    this.gameMusicPath = "../../audio/music/ost.mp3";

    this.startGameTime = null;
    this.finishGameTime = null;
    this.bossIsKilled = false;
  }

  initPlayer(obj) {
    this.player = obj;
  }

  update() {
    if (!this.player) {
      return;
    }

    const currentDate = Date.now();
    const diffDate = currentDate - this.lastSpawnTime;
    if (diffDate > 12000) {
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

  updatePlayerHUD() {
    document.getElementById("lives").textContent = this.player.lives;
    document.getElementById("damage").textContent = this.player.damage;
    document.getElementById("speed").textContent = this.player.speed;
    document.getElementById("kills").textContent = gameManager.killCount;
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
        if (this.lvl === 2 && entity instanceof Needles) {
          this.handleGameWin();
        } else if (this.lvl === 1) {
          this.killCount++;
          if (this.killCount >= this.maxKills) {
            this.nextLevel();
          }
        }
        this.updatePlayerHUD();
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
      "../../assets/sprites/spritesheet.png"
    );

    mapManager.parseEntities();
    mapManager.draw(ctx);

    this.updateLevelObjective();
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

  gameOver() {
    if (this.player) {
    
      setTimeout(() => {
        this.gameOverFlag = true;
        this.finishGameTime = Date.now();
        const gameTime = Math.round((this.finishGameTime - this.startGameTime) / 1000);
        
        this.displayMessage("Game Over! Press SPACE or Enter for return to main menu");
        
        const onKeyPress = (event) => {
          if (event.key === " " || event.key === "Enter") {
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

  win() {
    this.gameOverFlag = true;
  }

  nextLevel() {
    this.lvl += 1;
    
    const playerState = {
      lives: this.player.lives,
      damage: this.player.damage,
      speed: this.player.speed,
      hasBeenTrapped: this.player.hasBeenTrapped,
      isSpeedDebuffed: this.player.isSpeedDebuffed,
      defaultSpeed: this.player.defaultSpeed
    };

    this.entities = [];
    this.killCount = 0;
    
    this.isBossLevel = (this.lvl === 2);
    
    mapManager.reset();
    this.loadAll(ctx, this.lvl);

    setTimeout(() => {
      if (this.player) {
        this.player.lives = playerState.lives;
        this.player.damage = playerState.damage;
        this.player.speed = playerState.speed;
        this.player.defaultSpeed = playerState.defaultSpeed;
        this.player.hasBeenTrapped = playerState.hasBeenTrapped;
        this.player.isSpeedDebuffed = playerState.isSpeedDebuffed;
        
        this.updatePlayerHUD();
        this.updateLevelObjective();
      }
    }, 100);
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

  initSound() {
    if (!soundManager.loaded) {
      soundManager.init();
      soundManager.loadArray([this.gameMusicPath]);
    }

    // Добавляем обработчик для начала воспроизведения по действию пользователя
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

  displayMessage(message) {
    if (!message) return; // Guard clause for undefined messages

    // Remove any existing message containers
    const existingContainer = document.querySelector(".message-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new message container
    const messageContainer = document.createElement("div");
    messageContainer.className = "message-container";
    document.body.appendChild(messageContainer);

    // Add visible class after a small delay to trigger fade-in
    setTimeout(() => {
      messageContainer.classList.add("visible");
    }, 10);

    // Animate text typing
    let currentText = "";
    const typeSpeed = 50; // Speed of typing in milliseconds

    const typeWriter = (text, index) => {
      if (index < text.length) {
        currentText += text[index];
        messageContainer.textContent = currentText;
        setTimeout(() => typeWriter(text, index + 1), typeSpeed);
      }
    };

    // Start typing animation
    typeWriter(message.toString(), 0); // Convert message to string to ensure it has length

    // Remove message after delay
    setTimeout(
      () => {
        messageContainer.classList.add("fade-out");
        setTimeout(() => {
          messageContainer.remove();
        }, 500); // Match this with the CSS transition duration
      },
      message.toString().length * typeSpeed + 2000
    ); // Display duration based on message length plus extra time
  }
}

function updateWorld() {
  gameManager.update();
}

const gameManager = new GameManager();
