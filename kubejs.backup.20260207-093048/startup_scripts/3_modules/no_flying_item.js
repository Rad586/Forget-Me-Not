function no_flying_item(entity) {
    if (!entity.tags.contains("flying")) return;
    entity.setNoGravity(false);
    entity.setGlowing(false)
}