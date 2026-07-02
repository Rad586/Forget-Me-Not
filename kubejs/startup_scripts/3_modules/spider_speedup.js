function spider_speedup(entity) {
    const { level } = entity;
    if(level.isClientSide() || level.moonBrightness < 1 || entity.tags.contains('speed')) return;
    entity.addTag('speed');
    entity.potionEffects.add("minecraft:speed", 60, 0, true, false);
}