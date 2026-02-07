function wolf_hp_fix_log(context) {
    const { entity } = context, { server } = entity;
    if (!server || !entity.owner) return false;

    server.scheduleInTicks(0, () => {
        entity.persistentData.health = entity.health
    })
    return false;
}
function wolf_hp_fix_refresh(entity) {
    if (!entity.server) return;

    const { persistentData: { health } } = entity;
    if (!isNaN(health)) entity.setHealth(health);
}