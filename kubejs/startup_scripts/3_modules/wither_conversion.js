function wither_conversion(context) {
    const { entity } = context, { level } = entity;
    if (
        level.isClientSide() ||
        context.damageSource.type != "wither" ||
        !entity.isAlive()
    ) return;

    const { persistentData: pData } = entity;
    if (pData.wither == null) pData.wither = 0;
    pData.wither++;
    if (pData.wither < 4) return;

    const w_skeleton = level.createEntity("minecraft:wither_skeleton");
    w_skeleton.copyPosition(entity);
    w_skeleton.setMainHandItem(entity.mainHandItem);
    w_skeleton.setHealth(entity.health);
    w_skeleton.setRotation(entity.yaw, entity.pitch);
    w_skeleton.spawn();
    entity.discard();

    const { x, y, z } = entity;
    entity.playSound("entity.wither.shoot", 0.4, 1);
    level.spawnParticles("minecraft:soul_fire_flame", true, x, y + 0.5, z, 0.08, 0.08, 0.08, 4, 0);
    level.spawnParticles("minecraft:sculk_soul", true, x, y + 0.5, z, 0.08, 0.08, 0.08, 3, 0.06)
}