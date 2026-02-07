function nan_fix(actual, entity) {
    if (entity.level.isClientSide() ||
        !isNaN(entity.health) ||
        !actual ||
        !actual.isPlayer()) return;

    entity.setHealth(2);
    entity.attack(actual, 1000);
}