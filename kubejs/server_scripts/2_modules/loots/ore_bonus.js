function ore_bonus(e) {
	const ore_bonus_map = {
		"coal": "diamond",
		"iron": "raw_gold",
		"gold": "emerald"
	};
    Object.keys(ore_bonus_map).forEach(key => {
		const data = ore_bonus_map[key];
		e.addBlockLootModifier(`minecraft:${key}_ore`)
			.randomChance(0.005)
			.addLoot(data)

		e.addBlockLootModifier(`minecraft:deepslate_${key}_ore`)
			.randomChance(0.015)
			.addLoot(data)
	})
}