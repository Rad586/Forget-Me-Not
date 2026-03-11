const coral_map = {
    "minecraft:water_bucket": {
        sound: ["item.bucket.empty", 0.8],
        count: 6
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

NetworkEvents.dataReceived("coral_dry", e => {
    const { player, level } = e, { pos, dead_form } = e.data;
    const x = pos[0], y = pos[1], z = pos[2];
    const block = level.getBlock(x, y, z);

    block.set(dead_form, block.properties);

    level.spawnParticles("flame", true,
        x + 0.5, y + 0.5, z + 0.5,
        0.1, 0.1, 0.1,
        5, 0.04
    );
    level.playSound(
        null,
        x + 0.5, y + 1, z + 0.5,
        "item.flintandsteel.use", "master",
        1, 1
    )
    player.swing()
})

NetworkEvents.dataReceived("coral_wet", e => {
    const { player, level } = e, { pos, id } = e.data;
    const item = player.mainHandItem;
    const info = coral_map[item.id];
    const x = pos[0], y = pos[1], z = pos[2];
    const block = level.getBlock(pos);

    if (info.action) info.action(item, player);
    block.set(id, block.properties);

    level.spawnParticles("splash", true,
        x + 0.5, y + 1, z + 0.5,
        0.1, 0.1, 0.1,
        info.count, 2
    );
    level.playSound(
        null,
        x + 0.5, y + 1, z + 0.5,
        info.sound[0], "blocks",
        info.sound[1], 1.6
    )
    player.swing()
})