function flame_effect(e) {
    e.addLootTypeModifier(LootType.ENTITY)
        .killedByPlayer()
        .randomChanceWithEnchantment("minecraft:fire_aspect", [0, 1, 1])
        .entityPredicate(entity => {
            global.particleBurst(
                entity, "flame", 
                6, 0.08, entity.boundingBox.size / 3.2
            )
            return true
        })

    e.addLootTypeModifier(LootType.ENTITY)
        .killedByPlayer()
        .randomChanceWithEnchantment("minecraft:soul_fire_aspect", [0, 1, 1])
        .entityPredicate(entity => {
            global.particleBurst(
                entity, "soul_fire_flame",
                6, 0.08, entity.boundingBox.size / 3.2
            )
            return true
        })
}