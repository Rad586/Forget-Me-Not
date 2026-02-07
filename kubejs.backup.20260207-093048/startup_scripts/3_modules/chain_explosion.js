function chain_explosion(context) {
    const {entity} = context;
    if(entity.level.isClientSide() || context.damageSource.type != "explosion.player") return;
    entity.heal(context.damageAmount * 0.5);
    entity.ignite();
}