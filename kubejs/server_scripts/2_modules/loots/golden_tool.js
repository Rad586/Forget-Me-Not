let processing_bl = false

function golden_tool(e) {
    e.addLootTypeModifier(LootType.BLOCK)
        .matchMainHand([
            "minecraft:golden_pickaxe", "minecraft:golden_axe",
            "minecraft:golden_shovel", "minecraft:golden_hoe"
        ])
        .playerPredicate(p => !!p && !processing_bl)
        .apply(c => {
            processing_bl = true;

            c.removeLoot(ItemFilter.ALWAYS_TRUE);
            global.getBlockLoot(
                c.level,
                c.player,
                c.tool.enchant("silk_touch", 1),
                c.getDestroyedBlock()
            ).forEach(s => c.addLoot(s));

            processing_bl = false
        })
        .functions("#c:ores", s => s.smeltLoot())
}