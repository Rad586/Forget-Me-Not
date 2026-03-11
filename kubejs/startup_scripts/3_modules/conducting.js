function conducting(entity) {
    if (entity.block.id != "minecraft:water") return;
    const aabb = entity.boundingBox.inflate(12, 1, 12);
    entity.level.getEntitiesWithin(aabb).forEach(en => {
        if (!en.isLiving() || !en.isAlive()) return;
        en.attack("lightningBolt", Math.min(5, 12 / en.distanceToEntity(entity)))
    })
}