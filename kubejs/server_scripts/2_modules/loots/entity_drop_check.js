function entity_drop_check(e) {
	e.addLootTypeModifier(LootType.ENTITY)
		.not(n => n.killedByPlayer())
		.entityPredicate(() => global.drop_requires_player == true) /* a global constant in server loaded event */
		.removeLoot(ItemFilter.ALWAYS_TRUE)
}