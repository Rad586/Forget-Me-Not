function golden_tool(e) {
    e.addLootTypeModifier(LootType.BLOCK)
        .matchMainHand([
            "minecraft:golden_pickaxe", "minecraft:golden_axe",
            "minecraft:golden_shovel", "minecraft:golden_hoe"
        ])
        .functions("#c:ores", s => s.smeltLoot())
        .apply(c => {
            if (global.processingBlockLoot == true) return;

            c.removeLoot(ItemFilter.ALWAYS_TRUE);
            global.getBlockLoot(
                c.level,
                c.player,
                c.tool.enchant("silk_touch", 1),
                c.getDestroyedBlock()
            ).forEach(s => c.addLoot(s))
        })
}