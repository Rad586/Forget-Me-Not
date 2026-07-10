function mounted_mobs(entity, riderData) {
    if (Math.random() > 0.01) return;
    const { level } = entity;
    if(level.getDayTime() / 24000 < 32 || entity.tags.contains("kjsed")) return;
    entity.addTag("kjsed");

    const rider = global.spawnEntity(level, 
        riderData, entity.blockPosition());
    rider.startRiding(entity)
}