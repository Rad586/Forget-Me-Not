/* Idea from Don't Make Me Turn This Boat Around(https://www.curseforge.com/minecraft/mc-mods/dmmttba) */
ItemEvents.entityInteracted(e => {
    const { player, target } = e;
    if (
        e.hand == "off_hand" ||
        player.isCrouching() ||
        !(target instanceof Boat)
    ) return;

    const new_boat = e.level.createEntity(target.encodeId);
    new_boat.copyPosition(target);
    new_boat.setDeltaMovement(target.deltaMovement);
    new_boat.setRotation(player.yaw, 0)

    new_boat.spawn();
    target.discard();

    player.startRiding(new_boat);
    e.cancel()
})