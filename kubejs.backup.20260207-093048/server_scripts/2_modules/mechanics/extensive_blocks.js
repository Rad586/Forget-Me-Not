const extensiveBlocks = [
    "minecraft:redstone_wire", "minecraft:ladder", "minecraft:rail",
    "minecraft:powered_rail", "minecraft:detector_rail", "minecraft:activator_rail"
];

extensiveBlocks.forEach(eBlock => {
    BlockEvents.rightClicked(eBlock, e => {
        const { player } = e;
        if (!player.isCrouching()) return;

        const { facing } = player, { opposite } = facing;
        if (e.facing == opposite) return;

        const { level, block, item } = e
        let nextBlock = block, blockPos;

        for (let i = 0; i < 24; i++) {
            nextBlock = nextBlock[facing];
            blockPos = nextBlock.pos;
            if (nextBlock.id != eBlock) break;
        };

        const final = item.useOn(
            new UseOnContext(
                level, player, null, item,
                new BlockHitResult(null, opposite, blockPos, true)
            )
        );

        if (final != "CONSUME") return;
        player.swing();
        level.playSound(null, blockPos, "minecraft:block.stone.place", "blocks", 1, 1);

        e.cancel()
    })
})