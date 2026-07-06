function temperature(level, player, pos) {
	if (level.difficulty.getKey() != "hard") return;

	const biome = global.getBiomeAt(pos);
	const hot_biomes_info = global.biomeList["hot"].biomes;
	const cold_biomes_info = global.biomeList["cold"].biomes;

	const temp_hot = hot_biomes_info[biome];
	const temp_cold = cold_biomes_info[biome];

	if (temp_hot) {
		if (hot_biomes_info.criteria(player)) return;
		player.potionEffects.add("kubejs:hot", 21, temp_hot - 1, true, false)
	}
	else if (temp_cold) {
		if (cold_biomes_info.criteria(player)) return;
		player.potionEffects.add("kubejs:cold", 21, temp_cold - 1, true, false)
	}
}