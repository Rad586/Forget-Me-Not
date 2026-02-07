function entity_drop_check(e) {
	e.addLootTypeModifier(LootType.ENTITY)
		.not(n => n.killedByPlayer())
		.entityPredicate(() => !entity_drop) /* a global constant in server loaded event */
		.removeLoot(ItemFilter.ALWAYS_TRUE)
}