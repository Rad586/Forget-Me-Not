function midas_curse(e) {
	e.addLootTypeModifier(LootType.ENTITY)
		.playerPredicate(player => player.hasEffect("kubejs:midas_curse"))
		.entityPredicate(entity => entity.isMonster())
		.replaceLoot(ItemFilter.ALWAYS_TRUE, "minecraft:gold_nugget", true)
}