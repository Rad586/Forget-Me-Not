function wolf_hp_fix_log(context) {
    const { entity } = context, { server } = entity;
    if (!server || !entity.owner) return false;

    server.scheduleInTicks(1, () => {
        entity.persistentData.health = entity.health
    })
    return false;
}
function wolf_hp_fix_refresh(entity) {
    const { health } = entity.persistentData;
    if (!isNaN(health)) entity.setHealth(health);
}