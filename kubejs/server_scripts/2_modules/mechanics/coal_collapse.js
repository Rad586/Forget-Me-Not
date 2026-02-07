const coal_ores = [
    "minecraft:coal_ore", "minecraft:deepslate_coal_ore",
    "minecraft:copper_ore", "minecraft:deepslate_copper_ore"
]
coal_ores.forEach(key => BlockEvents.broken(key, e => {
    const { player, level, server, block: eblock } = e;
    if (player.isCrouching()) return;
    const checked = new Set();

    const collapse = (block, depth, checked) => {
        if (depth == 0) return;
        const { x, y, z } = block;

        [1, -1].forEach(mul => {
            [[mul, 0, 0], [0, mul, 0], [0, 0, mul]].forEach(([dx, dy, dz]) => {
                const pos = [x + dx, y + dy, z + dz];
                const pos_string = pos.toString();

                if (checked.has(pos_string)) return;
                checked.add(pos_string);

                server.scheduleInTicks(random.nextInt(0, 12), () => {
                    const block = level.getBlock(pos);
                    if (!coal_ores.includes(block.id)) return;

                    level.destroyBlock(pos, true, player);
                    if (Math.random() < 0.8) {
                        level.spawnParticles("campfire_cosy_smoke", true, x + 0.5, y + 0.5, z + 0.5, 0.15, 0.15, 0.15, 1, 0.004);
                    };

                    collapse(block, depth - 1, checked);
                })
            })
        })
    };
    collapse(eblock, 17, checked);
    global.particleBurstBlock2(eblock, "campfire_cosy_smoke", 1, 0.004, 0.15)
}))