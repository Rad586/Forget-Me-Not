global.Bushes.forEach(bush => {
    BlockEvents.leftClicked(bush.id, e => {
        const { player } = e;
        if (!player.isCrouching() || !(e.item.item instanceof HoeItem)) return;
        const { block, level, server } = e, { x, y, z } = block, around = [-1, 0, 1];

        if (!(Block.get(block.id) instanceof CropBlock)) {
            around.forEach(m => {
                around.forEach(n => {
                    server.scheduleInTicks(m + 2, () => {
                        const nBlock = block.offset(m, 0, n);
                        const nBlock2 = Block.get(nBlock.id);
                        if (nBlock2 instanceof BushBlock && !(nBlock2 instanceof CropBlock)) {
                            level.destroyBlock([x + m, y, z + n], true)
                        }
                    })
                })
            })
        }
        else {
            around.forEach(m => {
                around.forEach(n => {
                    server.scheduleInTicks(m + 2, () => {
                        const nBlock = block.offset(m, 0, n);
                        if (nBlock.id == id) level.destroyBlock(pos, true)
                    })
                })
            })
        };

        player.swing();
        level.spawnParticles(
            "minecraft:sweep_attack",
            true,
            x + 0.5, y + 0.5, z + 0.5,
            0, 0, 0,
            1, 0
        )
    })
})