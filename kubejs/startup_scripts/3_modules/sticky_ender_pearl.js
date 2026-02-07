function sticky_ender_pearl_entity(entity, target) {
    const {level} = entity;
    if(level.isClientSide()) return;

    entity.server.scheduleInTicks(2, () => {
        global.particleBurst(entity, "minecraft:dragon_breath", 20, 0.2);
        global.sound(entity, "entity.enderman.teleport", 1, 0.8, 0.2);
    });
    entity.discard();

    const {owner} = entity;
    if(!owner) return;
    const {x, y, z} = target;

    target.potionEffects.add("kubejs:pull", 6, 2, true, false);
    target.potionEffects.add("slowness", 40, 1);
    owner.teleportTo(level.dimension, x, y, z, owner.yaw, owner.pitch);
};
function sticky_ender_pearl_block(entity, result) {
    const {level} = entity;
    if(level.isClientSide()) return;

    const {motionX, motionY, motionZ, owner} = entity;
    const {direction, blockPos} = result;
    const next_block = level.getBlock(blockPos.x, blockPos.y, blockPos.z)[direction];
    const {x, y, z} = next_block;

    if(!entity.tags.contains("kjsed")) {
        global.bounce(entity, direction, motionX, motionY, motionZ);
        entity.addTag("kjsed");
        return;
    }
    if(owner) owner.teleportTo(level.dimension, x+0.5, y+0.5, z+0.5, owner.yaw, owner.pitch);
    entity.discard();

    entity.server.scheduleInTicks(2, () => {
        global.particleBurst(entity, "minecraft:dragon_breath", 20, 0.2);
        global.sound(entity, "entity.enderman.teleport", 0.4, 0.8);
    })
}