class Needles extends Entity {
  constructor() {
    super();
    this.lives = 4;
    this.direction = "down";
    this.width = 61;
    this.height = 107;
    this.hitboxOffset = { xOffset: 0, yOffset: 0 };
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset,
      },
      width: this.width,
      height: this.height,
    };
    this.speed = 3;
    this.animations = {
      stayRight: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_right/Needles_walk_right-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayLeft: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_left/Needles_walk_left-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayUp: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_up/Needles_walk_up-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      stayDown: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_down/Needles_walk_down-0.png",
        framerate: 1,
        frameBuffer: 60,
        loop: false,
      },
      walkLeft: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_left/Needles_walk_left-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkRight: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_right/Needles_walk_right-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkUp: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_up/Needles_walk_up-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      walkDown: {
        imageSource:
          "tiles/Enemies/Needles/WalkAnimations/Needles_walk_down/Needles_walk_down-",
        framerate: 4,
        frameBuffer: 12,
        loop: true,
      },
      inTrap: {
        imageSource:
          "tiles/Enemies/Needles/TrapAnimations/Needles_trap/Needles_trap-",
        framerate: 8,
        frameBuffer: 24,
        loop: false,
      },
    };
    this.isTrapped = false;
    this.isHitByPlayer = false;
    this.currentAnimation = this.animations.stayDown;
    this.lastTakeHitDate = null;
  }

  update() {
    const currentDate = Date.now();
    const diffDate = currentDate - this.lastTakeHitDate;
    if (diffDate > 2000) {
      this.isHitByPlayer = false;
    }

    if (!this.isHitByPlayer) {
      this.chaseFunction(this, gameManager.player);
    }

    physicManager.update(this);

    const isMoving =
      Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.y) > 0.01;

    if (!this.isTrapped) {
      if (isMoving) {
        const animationType =
          "walk" +
          this.direction.charAt(0).toUpperCase() +
          this.direction.slice(1);
        this.switchAnimation(animationType);
      } else {
        const stayAnimation =
          "stay" +
          this.direction.charAt(0).toUpperCase() +
          this.direction.slice(1);
        this.switchAnimation(stayAnimation);
      }
    }

    const entity = physicManager.entityAtXY(this);
    if (entity) {
      this.onTouch(entity);
    }

    this.updateAnimation();
  }

  draw() {
    spriteManager.drawSprite(ctx, this, this.position.x, this.position.y);
  }

  chaseFunction(enemy, player) {
    // Разность координат
    const dx = player.hitbox.position.x - enemy.hitbox.position.x;
    const dy = player.hitbox.position.y - enemy.hitbox.position.y;

    // Вычисление длины вектора (гипотенуза)
    const distance = Math.sqrt(dx * dx + dy * dy);
    // console.log("Distance: ", distance);

    // Пороговое значение для остановки
    const STOP_THRESHOLD = 3;

    // Если игрок слишком далеко, двигаться к нему
    if (distance > STOP_THRESHOLD) {
      // Нормализация вектора направления
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;

      // Устанавливаем velocity для движения
      enemy.velocity.x = normalizedX * this.speed;
      enemy.velocity.y = normalizedY * this.speed;

      // Перемещение enemy
      enemy.position.x += enemy.velocity.x;
      enemy.position.y += enemy.velocity.y;

      // Определение направления движения на основе преобладающей скорости
      if (Math.abs(enemy.velocity.x) > Math.abs(enemy.velocity.y)) {
        enemy.direction = enemy.velocity.x > 0 ? "right" : "left";
      } else {
        enemy.direction = enemy.velocity.y > 0 ? "down" : "up";
      }
    } else {
      enemy.velocity.x = 0;
      enemy.velocity.y = 0;
    }
  }

  takeAttack() {
    this.isHitByPlayer = true;
    this.lives--;
    this.lastTakeHitDate = this.lastTakeHitDate ?? Date.now();
    console.log("Current enemy", this);
  }

  onTouch(entity) {
    if (entity instanceof Trap && !entity.isActivate) {
      const enemyFeetY = this.hitbox.position.y + this.hitbox.height;
      const trapTopY = entity.hitbox.position.y;
      const trapBottomY = entity.hitbox.position.y + entity.hitbox.height;

      if (enemyFeetY > trapTopY && enemyFeetY <= trapBottomY) {
        this.lives--;
        this.isTrapped = true;
        console.log("Trap activated by enemy");
        this.speed = 0;
        this.switchAnimation("inTrap");
        
        entity.isActivate = true;
        entity.isVisible = false;
        entity.switchAnimation("trapAnimation");

        setTimeout(() => {
          this.speed = 3;
          this.isTrapped = false;
          entity.isVisible = true;
        }, 3000);
      }
    }
  }
}
