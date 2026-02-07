function elder_guardian(context) {
    const { entity } = context, { server } = entity;
    if (!server || !context.damageSource.getPlayer()) return;

    const players = server.players.filter(p =>
        p.distanceToEntity(entity) < 64 &&
        p.hasEffect("mining_fatigue")
    );
    entity.playSound("minecraft:block.bell.resonate", 1.2, 2);
    server.scheduleInTicks(13, () => {
        players.forEach(p => {
            p.removeEffect("minecraft:mining_fatigue");
            p.statusMessage = Text.translate("dialogue.fmn.elder_guardian");
            global.particleBurst(p, "andromeda:knockoff_totem_particles", 14, 0.4)
        })
    })
}