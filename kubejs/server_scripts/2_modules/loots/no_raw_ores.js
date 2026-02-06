function no_raw_ores(e) {
    e.addLootTypeModifier(LootType.values())
        .replaceLoot("minecraft:raw_iron", "minecraft:iron_ingot")
        .replaceLoot("minecraft:raw_gold", "minecraft:gold_ingot")

    e.addLootTypeModifier(LootType.BLOCK)
        .randomChanceWithEnchantment("minecraft:silk_touch", [1, 0])
        .replaceLoot("minecraft:raw_iron_block", "minecraft:iron_block")
        .replaceLoot("minecraft:raw_gold_block", "minecraft:gold_block")

    e.addLootTypeModifier(LootType.values().filter(l => l != LootType.BLOCK))
        .replaceLoot("minecraft:raw_iron_block", "minecraft:iron_block")
        .replaceLoot("minecraft:raw_gold_block", "minecraft:gold_block")
}