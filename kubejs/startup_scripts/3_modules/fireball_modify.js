function fireball_modify_tick(entity) {
    if(entity.age > 600) entity.discard();
}