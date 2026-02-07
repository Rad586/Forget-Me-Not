function ore_hurt(context) {
    const {entity} = context;
    if(entity.level.isClientSide()) return;
    const player = context.damageSource.getPlayer();
    if(!player) return;

    global.torch_alert(player);
    entity.potionEffects.add("speed", 180, 3, true, false);
    entity.goalSelector.addGoal(1, new AvoidEntityGoal(entity, Player, 12, 1, 1)); //only survival mode + non-peaceful difficulty can trigger

    if(!(player.mainHandItem.item instanceof PickaxeItem)) return;
    entity.health -= 2;
};
function ore_spawn(entity) {
    if(entity.y > 16) entity.discard();
}