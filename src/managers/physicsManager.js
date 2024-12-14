class PhysicManager {
  update(entity) {
    if (entity instanceof Needles && gameManager.lvl === 1 && entity.isRunningAway) {
      entity.position.x += entity.velocity.x;
      entity.position.y += entity.velocity.y;
      
      entity.hitbox.position.x = entity.position.x + entity.hitboxOffset.xOffset;
      entity.hitbox.position.y = entity.position.y + entity.hitboxOffset.yOffset;
      return;
    }

    const oldX = entity.position.x;
    const oldY = entity.position.y;

    entity.position.x += entity.velocity.x;
    entity.position.y += entity.velocity.y;

    if (entity.name === "Needles" || entity.name === "Player") {
      const checkArea = this.stayWithinWalkingArea(entity);
      if (!checkArea) {
        entity.position.x = oldX;
        entity.position.y = oldY;
      }
    }
    this.updateHitbox(entity);
    this.stayWithinBounds(entity);
  }

  updateHitbox(entity) {
    entity.hitbox.position.x = entity.position.x + entity.hitboxOffset.xOffset;
    entity.hitbox.position.y = entity.position.y + entity.hitboxOffset.yOffset;
  }

  stayWithinWalkingArea(entity) {
    let newX = entity.position.x;
    let newY = entity.position.y;
    const ts = mapManager.getTilesetIdxOnWalkingArea(
      newX + entity.width / 2,
      newY + entity.height / 2
    );
    const walkingArea = mapManager.mapData.layers.find(
      (layer) => layer.name === "WalkArea"
    );
    return walkingArea?.data.includes(ts) && ts !== 0;
  }

  stayWithinBounds(entity) {
    if (entity.position.x < 0) {
      entity.position.x = 0;
    } else if (entity.position.x + entity.hitbox.width > mapManager.mapSize.x) {
      entity.position.x = mapManager.mapSize.x - entity.hitbox.width;
    }

    if (entity.position.y < 0) {
      entity.position.y = 0;
    } else if (
      entity.position.y + entity.hitbox.height >
      mapManager.mapSize.y
    ) {
      entity.position.y = mapManager.mapSize.y - entity.hitbox.height;
    }
  }

  entityAtXY = (obj) => {
    for (let i = 0; i < gameManager.entities.length; i++) {
      let e = gameManager.entities[i];
      if (e.name !== obj.name && this.checkCollision(obj, e)) {
        return e;
      }
    }
    return null;
  };

  getEntitiesInRange(entity, range) {
    return gameManager.entities.filter((other) => {
      if (other === entity) return false;

      const dx = other.position.x - entity.position.x;
      const dy = other.position.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance <= range;
    });
  }

  checkCollision(entity1, entity2) {
    return (
      entity1.hitbox.position.x <=
        entity2.hitbox.position.x + entity2.hitbox.width &&
      entity1.hitbox.position.x + entity1.hitbox.width >=
        entity2.hitbox.position.x &&
      entity1.hitbox.position.y <=
        entity2.hitbox.position.y + entity2.hitbox.height &&
      entity1.hitbox.position.y + entity1.hitbox.height >=
        entity2.hitbox.position.y
    );
  }
}

const physicManager = new PhysicManager();
