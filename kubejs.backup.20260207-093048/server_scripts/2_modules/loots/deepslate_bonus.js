function deepslate_bonus(e) {
	const deepslate_ores = [
		"coal", "iron", "gold", "emerald",
		"diamond", "lapis", "redstone"
	];
	deepslate_ores.forEach(ore => {
		e.addBlockLootModifier(`minecraft:deepslate_${ore}_ore`)
			.randomChance(0.3)
			.modifyLoot(ItemFilter.ALWAYS_TRUE, stack => {
				stack.count *= 2;
				return stack
			})
	})
}