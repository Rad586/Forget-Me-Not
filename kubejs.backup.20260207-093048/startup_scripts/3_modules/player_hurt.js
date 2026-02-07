function fire_damages_shield(entity) {
    entity.hurtCurrentlyUsedShield(10);
}
function underwater(entity, level, x, y, z) {
    entity.airSupply -= entity.airSupply > 90 ? 30 : 0;
    global.sound(entity, "entity.player.hurt_drown", 0.6, 1.0, 0.2);
    level.spawnParticles("bubble_column_up", true, x, y, z, 0, 0, 0, 1, 0);
};
function player_hurt(context) {
    const {entity, damageSource} = context;
    const {type} = damageSource, {level} = entity;
    if(level.isClientSide()) return;

    if(
        (entity.hasEffect("kubejs:invincible") || entity.hasEffect("kubejs:parry")) ||
        (entity.getTicksFrozen() > 60 && ["inFire", "onFire"].includes(type)) ||
        (entity.hasEffect("kubejs:blast_immunity") && ["explosion", "explosion.player", "firework"].includes(type))
    ) 
    return true;

    const {actual} = damageSource;
    if(type == "onFire") fire_damages_shield(entity);
    else if(actual) {
        const {x, y, z} = entity;
        if(entity.isUnderWater()) underwater(entity, level, x, y, z);
    };
    return false;
}