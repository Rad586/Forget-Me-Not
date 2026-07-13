function golden_tool(e) {
    e.addLootTypeModifier(LootType.BLOCK)
        .matchMainHand([
            "minecraft:golden_pickaxe", "minecraft:golden_axe",
            "minecraft:golden_shovel", "minecraft:golden_hoe"
        ])
        .apply(c => {
            c.removeLoot(ItemFilter.ALWAYS_TRUE);
            global.getBlockLoot(
                c.level,
                c.tool.enchant("silk_touch", 1),
                c.getDestroyedBlock()
            ).forEach(s => c.addLoot(s))
        })
        .functions("#c:ores", s => s.smeltLoot())
}