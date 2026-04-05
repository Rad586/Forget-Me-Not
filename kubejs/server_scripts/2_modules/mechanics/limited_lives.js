function limited_lives(player) {
	const { stages } = player;
	if (stages.has("end")) {
		end_dim_fix_respawn(player);
		stages.remove("end");
		return;
	};

	if (stages.has("no_limited_lives")) return;
	const { level, persistentData: pData } = player;
	if (level.difficulty != "HARD") return;

	const { death_count } = pData;
	if (player.maxHealth > 6) pData.death_count = (death_count || 0) + 1;
	else player.unlockAdvancement("kubejs:tip/lowhp");

	global.updateMaxHealth(player)
}