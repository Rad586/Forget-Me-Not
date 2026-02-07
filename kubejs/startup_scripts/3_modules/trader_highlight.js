function trader_highlight(entity) {
    if(entity.level.isClientSide() || entity.tags.contains("kjsed")) return;
    entity.addTag("kjsed");
    entity.potionEffects.add("glowing", 100, 0, true, false);
}