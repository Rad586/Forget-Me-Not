const farmland_map = {
    "minecraft:water_bucket": {
        count: 6,
        sound: ["item.bucket.empty", 0]
    },
    "minecraft:potion": {
        count: 3,
        sound: ["item.bottle.empty", 0.45],
        action: (item, player) => {
            item.shrink(1);
            player.give("minecraft:glass_bottle");
        }
    }
};
Object.keys(farmland_map).forEach(id => {
    const info = farmland_map[id];

    ItemEvents.rightClicked(id, e => {
        const { item, player, level } = e, { Potion } = item.nbt;
        if (Potion && Potion != "minecraft:water") return;

        const block = level.getBlock(global.advancedRayTraceBlock(player, 4).blockPos);
        const { moisture } = block.properties;
        if (
            block.blockState.isAir() ||
            !moisture ||
            moisture == 7 ||
            player.isCrouching()
        ) return;

        const { x, y, z } = block;
        if (info.action) info.action(item, player);
        block.set("minecraft:farmland", { moisture: global.toInt(7) });

        level.spawnParticles("splash", true,
            x + 0.5, y + 1, z + 0.5,
            0.1, 0.1, 0.1,
            info.count, 2
        );
        if (info.sound) {
            level.playSound(
                null,
                x + 0.5, y + 1, z + 0.5,
                info.sound[0], "master",
                info.sound[1], 1.6
            )
        };
        player.swing();
        e.cancel()
    })
})