ItemEvents.entityInteracted("minecraft:shears", e => {
    const { target, player } = e, { ownerUUID } = target;
    if (!player.isCrouching() || !ownerUUID.equals(player.uuid)) return;

    target.setTame(false);
    target.playSound("entity.sheep.shear");
    target.playAmbientSound()
})