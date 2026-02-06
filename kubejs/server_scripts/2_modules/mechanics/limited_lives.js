function limited_lives(player) {
	const {stages} = player;
	if(stages.has("end")){
		end_dim_fix_respawn(player);
		stages.remove("end");
	}
	else {
		if(stages.has("no_limited_lives")) return;
		const {level, persistentData:pData} = player;
		if(["PEACEFUL", "EASY"].includes(`${level.difficulty}`)) return;

		const {death_count} = pData;
		if(player.maxHealth > 6) pData.death_count = death_count == null ? 1 : death_count+1;
		else player.unlockAdvancement("kubejs:tip/lowhp");

		global.updateMaxHealth(player);
	}
}