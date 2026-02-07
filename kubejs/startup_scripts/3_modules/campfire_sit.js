function campfire_sit_despawn(entity) {
    if(!entity.tags.contains("campfire") || !entity.passengers.isEmpty()) return;
    entity.discard();
}