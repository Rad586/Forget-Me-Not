NetworkEvents.dataReceived("water", e => {
    const { level, player, data } = e, { pos } = data;
    const block = level.getBlock(pos);

    Block2.dropResources(block.blockState, level, pos, null);
    block.set("minecraft:water");

    player.setMainHandItem("minecraft:bucket");
    global.sound(level, player, "item.bucket.empty", 0.68)
    player.swing()
})