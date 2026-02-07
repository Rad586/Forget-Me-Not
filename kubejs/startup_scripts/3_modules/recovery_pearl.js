function recovery_pearl(entity) {
    entity.discard();
    const {server, owner} = entity;
    if(!server || !owner) return;
    const {stages, nbt: {LastDeathLocation: info}} = owner;

    if(!stages.has("dead") || !info) {
        global.particleBurst(entity, "dragon_breath", 3, 0.06);
        global.sound(entity, "entity.ender_eye.death", 0.8, 1.2);
        owner.statusMessage = Text.translate("dialogue.fmn.tp1");
        return;
    };

    server.scheduleInTicks(2, () => {
        global.sound(owner, "block.respawn_anchor.set_spawn", 0.4, 2);
        global.sound(owner, "entity.enderman.teleport", 0.4, 0.72);
        global.sound(owner, "block.beacon.deactivate", 2, 0.5);
        global.particleRing("spread", 18, 0, 0, owner, "dragon_breath", 4)
    });

    owner.teleportTo(
        info.dimension, info.pos[0], info.pos[1], info.pos[2],
        owner.yaw, owner.pitch
    );
    owner.potionEffects.add("resistance", 100, 4);
    stages.remove("dead");
}