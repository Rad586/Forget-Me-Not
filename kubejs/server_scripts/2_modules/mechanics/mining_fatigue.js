PlayerEvents.advancement("kubejs:mining_fatigue", e => {
	const { player } = e;
	player.revokeAdvancement("kubejs:mining_fatigue");
	player.potionEffects.add("mining_fatigue", 20, 2, true, true)
})