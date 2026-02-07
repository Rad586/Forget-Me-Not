ItemEvents.entityInteracted("minecraft:shears", e => {
    const { target, player } = e, { owner } = target;
    if (!player.isCrouching() ||
        !(target instanceof OwnableEntity) ||
        !owner ||
        owner != player
    ) return;

    target.setTame(false);
    target.playSound("entity.sheep.shear");
    target.playAmbientSound()
})