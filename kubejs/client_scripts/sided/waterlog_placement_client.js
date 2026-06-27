ItemEvents.rightClicked("water_bucket", e => {
    const { player } = e;
    if (player.isCrouching()) return;

    const { target } = e, { block } = target;
    if (block.properties.waterlogged != "false") return;

    const { facing } = target;
    const c_facing = (block.id.endsWith("_stairs") && /* intuitive placing */
        player.eyeY - target.hitY < 2.5 && 
        block.y - target.hitY == -0.5 && 
        facing == "UP") ? 
        player.facing.getOpposite() : facing;

    const block2 = block[c_facing];
    if (!block2.blockState.canBeReplaced("minecraft:water")) return;

    player.sendData("water", { pos: [block2.x, block2.y, block2.z] });
    e.cancel()
})