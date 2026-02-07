function mindful_death(entity) {
    if (entity.tags.contains("kjsed")) return;
    entity.addTag("kjsed");

    const { level, x, y, z, uuid } = entity;
    level.getEntitiesWithin(AABB.of(x, y, z, x + 0.0001, y + 0.0001, z + 0.0001)).forEach(dead => {
        if (dead.isAlive()) return;
        if (dead.isPlayer()) {
            level.runCommandSilent(`team join deathitem ${uuid}`);
            entity.setMotion(0, 0, 0);
            entity.mergeNbt({ Age: -32768 });
            entity.setGlowing(true);
        }
        else entity.motionY += 0.26;  /* item toss */
    })
}