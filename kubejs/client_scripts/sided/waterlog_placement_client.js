ItemEvents.rightClicked("water_bucket", e => {
    const { player } = e;
    if (player.isCrouching()) return;

    const { target } = e, { block } = target;
    if (block.properties.waterlogged != "false") return;

    const { facing } = target, delta = player.eyeY - target.hitY;
    const c_facing = (block.hasTag("minecraft:stairs") && /* intuitive placing */
        block.y - target.hitY == -0.5 && 
        (delta < 2.5 && delta > 0.245) && 
        facing == "UP") ? 
        player.facing.getOpposite() : facing;

    const block2 = block[c_facing];
    if (!block2.blockState.canBeReplaced("minecraft:water")) return;

    player.sendData("water", { pos: [block2.x, block2.y, block2.z] });
    e.cancel()
})