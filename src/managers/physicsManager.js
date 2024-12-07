class PhysicManager {
  update(entity) {
    const oldX = entity.position.x;
    const oldY = entity.position.y;

    entity.position.x += entity.velocity.x;
    entity.position.y += entity.velocity.y;

    const checkArea = this.stayWithinWalkingArea(entity);
    if (!checkArea) {
      entity.position.x = oldX;
      entity.position.y = oldY;
    }

    this.updateHitbox(entity);
    this.stayWithinBounds(entity);
  }

  updateHitbox(entity) {
    entity.hitbox.position.x = entity.position.x + entity.hitboxOffset.xOffset;
    entity.hitbox.position.y = entity.position.y + entity.hitboxOffset.yOffset;
  }

  checkCollision(entity1, entity2) {
    return (
        entity1.position.x <= entity2.position.x + entity2.width &&
        entity1.position.x + entity1.width >= entity2.position.x &&
        entity1.position.y <= entity2.position.y + entity2.height &&
        entity1.position.y + entity1.height >= entity2.position.y
    );
  }

  stayWithinWalkingArea(entity) {
    let newX = entity.position.x;
    let newY = entity.position.y
    const ts = mapManager.getTilesetIdxOnWalkingArea(newX + entity.width / 2, newY + entity.height / 2);
    const walkingArea = mapManager.mapData.layers.find(layer => layer.name === "WalkArea");
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
    } else if (entity.position.y + entity.hitbox.height > mapManager.mapSize.y) {
      entity.position.y = mapManager.mapSize.y - entity.hitbox.height;
    }
  }
}

const physicManager = new PhysicManager()
