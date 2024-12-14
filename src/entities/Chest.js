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

    this.items = [
      {
        name: "Poison",
        effect: (player) => {
          player.lives -= 1;
          console.log("Player got poisoned! -1 HP");
        },
      },
      {
        name: "R'hyer Boots",
        effect: (player) => {
          player.speed *= 2;
          console.log("Speed doubled!");
        },
      },
      {
        name: "Light Blue Bottle",
        effect: (player) => {
          player.lives = Math.min(player.lives + 4, player.maxLives);
          player.hasBeenTrapped = false;
          player.isSpeedDebuffed = false;
          player.speed = player.defaultSpeed;
          console.log("Restored 4 HP and normalized speed");
        },
      },
      {
        name: "Red Virtue Sword",
        effect: (player) => {
          player.damage += 1;
          console.log("Damage increased by 1!");
        },
      },
    ];

    this.loot = null;
    this.isOpen = false;

    this.currentAnimation = this.animations.chestDefault;
  }

  update() {
    this.hitbox.position.x = this.position.x + this.hitboxOffset.xOffset;
    this.hitbox.position.y = this.position.y + this.hitboxOffset.yOffset;
    this.updateAnimation();
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  open(player) {
    // console.log(">>> Chest opened!");
    if (!this.isOpen) {
      this.isOpen = true;
      this.switchAnimation("chestAnimation");

      this.loot = this.items[Math.floor(Math.random() * this.items.length)];

      this.loot.effect(player);

      player.displayChestMessage(this.getLootMessage());
    }
  }

  getLootMessage() {
    switch (this.loot.name) {
      case "Poison":
        return "Player got poisoned! -1 HP";
      case "R'hyer Boots":
        return "Speed doubled!";
      case "Light Blue Bottle":
        return "Restored 4 HP and normalized speed";
      case "Red Virtue Sword":
        return "Damage increased by 1!";
      default:
        return "Unknown item!";
    }
  }

  displayChestMessage(message) {
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
    const typeSpeed = 50; // Speed of typing in milliseconds

    const typeWriter = (text, index) => {
      if (index < text.length) {
        currentText += text[index];
        messageContainer.textContent = currentText;
        setTimeout(() => typeWriter(text, index + 1), typeSpeed);
      }
    };

    typeWriter(message, 0);

    setTimeout(
      () => {
        messageContainer.classList.add("fade-out");
        setTimeout(() => {
          messageContainer.remove();
        }, 500); // Match this with the CSS transition duration
      },
      message.length * typeSpeed + 2000,
    ); // Display duration based on message length plus extra time
  }
}
