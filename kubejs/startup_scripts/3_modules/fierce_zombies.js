function fierce_zombies(entity) {
    const { level } = entity;
    if (level.isClientSide() || level.moonBrightness < 1) return;
    entity.potionEffects.add("minecraft:resistance", 40, 0, true, false);
}