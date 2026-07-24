/* credit: Waystones Pets Addon(https://www.curseforge.com/minecraft/mc-mods/waystones-pets-addon) */
Balm.getEvents().onEvent(WaystoneTeleportEventPre, e => {
    const context = e.getContext();
    const player = context.getEntity(), { level } = player;
    if (!player.isPlayer() || level.isClientSide()) return;

    level.getEntitiesWithin(player.boundingBox.inflate(5, 1, 5))
        .forEach(pet => {
            if (!pet.isLiving() ||
                String(pet.ownerUUID) != player.uuid) return;
            context.addAdditionalEntity(pet)
        })
})