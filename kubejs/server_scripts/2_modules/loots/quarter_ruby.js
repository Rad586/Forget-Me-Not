function quarter_ruby(e) {
    e.addLootTypeModifier([LootType.CHEST, LootType.ENTITY])
        .randomChance(0.75)
        .matchLoot("minecraft:netherite_scrap")
        .removeLoot(ItemFilter.ALWAYS_TRUE)
}