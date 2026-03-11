ItemEvents.rightClicked(["water_bucket", "potion"], e => {
    const { item, player, level } = e, { nbt } = item;
    if (nbt && nbt.Potion != "minecraft:water") return;

    const block = level.getBlock(global.advancedRayTraceBlock(player, 4).blockPos);
    const { moisture } = block.properties;
    if (block.blockState.isAir() ||
        !moisture ||
        moisture == 7 ||
        player.isCrouching()
    ) return;

    const { x, y, z } = block;
    player.sendData("farmland_wet", { pos: [x, y, z] });
    e.cancel()
})

BlockEvents.rightClicked("minecraft:farmland", e => {
    const { block, player } = e;
    if (!e.item.is("minecraft:flint_and_steel") ||
        player.isCrouching() ||
        block.properties.moisture == 0
    ) return;

    const { x, y, z } = block;
    player.sendData("farmland_dry", { pos: [x, y, z] });
    e.cancel()
})