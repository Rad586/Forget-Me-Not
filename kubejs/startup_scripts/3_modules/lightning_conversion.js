const lightning_converts = {
    "minecraft:coal_ore": "minecraft:deepslate_coal_ore",
    "minecraft:gold_ore": "minecraft:deepslate_gold_ore",
    "minecraft:lapis_ore": "minecraft:deepslate_lapis_ore",
    "minecraft:iron_ore": "minecraft:deepslate_iron_ore",
    "minecraft:emerald_ore": "minecraft:deepslate_emerald_ore",
    "minecraft:redstone_ore": "minecraft:deepslate_redstone_ore",
    "minecraft:sand": "minecraft:glass",
    "minecraft:red_sand": "minecraft:glass",
    "minecraft:gravel": "minecraft:glass",
    "minecraft:soul_sand": "minecraft:light_blue_stained_glass",
    "minecraft:stone": "minecraft:magma_block",
    "minecraft:cobblestone": "minecraft:magma_block",
    "minecraft:granite": "minecraft:magma_block",
    "minecraft:diorite": "minecraft:magma_block",
    "minecraft:andesite": "minecraft:magma_block",
    "minecraft:cobblestone": "minecraft:magma_block",
    "minecraft:raw_iron_block": "minecraft:iron_block",
    "minecraft:raw_gold_block": "minecraft:gold_block",
    "minecraft:mycelium": "minecraft:podzol",
    "minecraft:grass_block": "minecraft:podzol",
    "minecraft:podzol": "minecraft:coarse_dirt",
    "minecraft:dirt": "minecraft:coarse_dirt",
    "minecraft:mud": "minecraft:packed_mud",
    "minecraft:obsidian": "minecraft:crying_obsidian",
    "minecraft:soul_soil": "minecraft:soul_sand",
    "minecraft:stone_bricks": "minecraft:cracked_stone_bricks",
    "minecraft:mossy_cobblestone": "minecraft:cobblestone",
    "minecraft:clay": "minecraft:bricks",
    "minecraft:wet_sponge": "minecraft:sponge",
    "minecraft:netherrack": "minecraft:magma_block",
    "minecraft:glowstone": "minecraft:magma_block",
    "minecraft:basalt": "minecraft:glowstone",
    "minecraft:prismarine_bricks": "minecraft:prismarine"
}
const colors = [
    "red", "orange", "yellow", "green",
    "lime", "cyan", "light_blue", "blue",
    "purple", "pink", "magenta", "brown",
    "white", "light_gray", "gray", "black"
]
const suffixes = {
    "_terracotta": "_glazed_terracotta",
    "_concrete_powder": "_concrete"
}
colors.forEach(color => {
    Object.keys(suffixes).forEach(suffix => {
        const data = suffixes[suffix];
        lightning_converts[`minecraft:${color}${suffix}`] = `${color}${data}`;
    })
})

function lightning_conversion(entity) {
    const { x, y, z, level } = entity;
    global.particleBurstBlock(level, x, y, z, "flash", 1, 0, 0);

    const { down } = entity.block, { id } = down;
    if (Block.get(id) instanceof BushBlock) {
        down.set("minecraft:dead_bush")
        global.particleBurstBlock(level, x, y, z, "large_smoke", 8, 0.06, 0.1);
    }
    else if (Block.get(id) instanceof CampfireBlock) {
        const { properties } = down;
        if (properties.waterlogged == "true") return;

        down.set(id, { facing: properties.facing, lit: true });
        global.particleBurstBlock(level, x, y, z, "flame", 6, 0.08, 0.1);
    }
    else {
        const data = lightning_converts[id];
        if (!data) return;

        down.set(data);
        global.particleBurstBlock(level, x, y, z, "end_rod", 24, 0.3, 0.2);
    }
}