function fierce_zombies(entity, dragon_stage) {
    if(!dragon_stage || entity.level.isClientSide()) return;
    entity.potionEffects.add("minecraft:resistance", 40, 0, true, false);
}