function limited_lives(player) {
	if (global.limited_lives == false) return;

	const { level, persistentData: pData } = player;
	if (level.difficulty.getKey() != "hard") return;
	const { death_count } = pData;

	if (player.maxHealth > 6) {
		pData.death_count = (death_count || 0) + 1
	}
	else {
		player.unlockAdvancement("kubejs:tip/lowhp")
	};

	global.updateMaxHealth(player)
}