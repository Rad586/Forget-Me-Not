Object.keys(global.biomeList).forEach(temp => {
	const data = global.biomeList[temp];
	const {biomes, criteria} = data;
	const effectId = temp == "hot" ? "kubejs:hot" : "kubejs:cold";

	Object.keys(biomes).forEach(biome => {
		const keyHandler = `kubejs:${biome.split(":").join("_")}`;
		const level = biomes[biome];

		PlayerEvents.advancement(keyHandler, e => {
			const {player} = e;
			player.revokeAdvancement(keyHandler);

			if(criteria(player) || !player.server.persistentData.nether_stage) return;
			player.potionEffects.add(effectId, 21, level-1, true, false);
		})
	})
})