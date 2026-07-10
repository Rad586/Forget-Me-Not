function underwater(level, entity) {
    if (!entity.isUnderWater()) return;

    entity.airSupply = Math.max(90, entity.airSupply - 30);
    global.sound(level, entity, "entity.player.hurt_drown", 0.6, 1.0);
    level.spawnParticles(
        "bubble_column_up", 
        true,
        entity.x,
        entity.y,
        entity.z,
        0, 0, 0,
        1, 0
    )
}