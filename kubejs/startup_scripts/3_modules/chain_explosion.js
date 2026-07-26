function chain_explosion(context) {
    const { entity } = context;
    if (entity.level.isClientSide() || 
        context.damageSource.type != "explosion.player") return;
    
    const { damageAmount } = context;
    if(damageAmount < 10) return;

    entity.heal(damageAmount * 0.5);
    entity.ignite()
}