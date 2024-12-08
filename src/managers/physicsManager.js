class PhysicManager {
  update(entity) {
    const oldX = entity.position.x;
    const oldY = entity.position.y;

    entity.position.x += entity.velocity.x;
    entity.position.y += entity.velocity.y;

    if(entity.name === "Needles" || entity.name === "Player") {
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

  // intersects = (obj1, obj2) => {
  //   return (
  //     obj1.hitbox.position.x < obj2.hitbox.position.x + obj2.hitbox.width &&
  //     obj1.hitbox.position.x + obj1.hitbox.width > obj2.hitbox.position.x &&
  //     obj1.hitbox.position.y < obj2.hitbox.position.y + obj2.hitbox.height &&
  //     obj1.hitbox.position.y + obj1.hitbox.height > obj2.hitbox.position.y
  //   )
  // }

  entityAtXY = (obj) => {
    for (let i = 0; i < gameManager.entities.length; i++) {
      let e = gameManager.entities[i]
      if (e.name !== obj.name && this.checkCollision(obj, e)) {
        //console.log("<><><><>", e.name);
        return e
      }
    }
    return null
  }

  checkCollision(entity1, entity2) {
    return (
        entity1.hitbox.position.x <= entity2.hitbox.position.x + entity2.hitbox.width &&
        entity1.hitbox.position.x + entity1.hitbox.width >= entity2.hitbox.position.x &&
        entity1.hitbox.position.y <= entity2.hitbox.position.y + entity2.hitbox.height &&
        entity1.hitbox.position.y + entity1.hitbox.height >= entity2.hitbox.position.y
    );
  }
}

const physicManager = new PhysicManager()
