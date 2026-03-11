NetworkEvents.dataReceived("extensive_blocks", e => {
    const { level, player, data } = e, { opposite, pos, eBlock, facing } = data;
    const block = level.getBlock(pos), item = player.mainHandItem;

    let nextBlock = block, blockPos;

    for (let i = 0; i < 24; i++) {
        nextBlock = nextBlock[facing];
        blockPos = nextBlock.pos;
        if (nextBlock.id != eBlock) break;
    };

    if (!item.useOn(new UseOnContext(
        level, player, null, item,
        new BlockHitResult(null, opposite, blockPos, true)
    )).consumesAction()) return;

    player.swing();
    level.playSound(null, blockPos.offset(0.5, 0.5, 0.5), "minecraft:block.stone.place", "blocks", 1, 1);
})