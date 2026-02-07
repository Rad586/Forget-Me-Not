function spider_speedup(entity, dragon_stage) {
    if(!dragon_stage || entity.level.isClientSide() || entity.tags.contains('speed')) return;
    entity.addTag('speed');
    entity.potionEffects.add("minecraft:speed", 60, 0, true, false);
}