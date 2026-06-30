function iron_golem(e) {
    e.addEntityLootModifier("minecraft:iron_golem")
        .entityPredicate(entity => !entity.nbt.PlayerCreated)
        .replaceLoot("minecraft:iron_ingot", "kubejs:iron_golem", false)
}