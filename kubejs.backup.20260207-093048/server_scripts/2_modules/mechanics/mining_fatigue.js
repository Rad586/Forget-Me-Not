[
	"repurposed_structures:temple_taiga", "repurposed_structures:temple_ocean",
	"betterjungletemples:jungle_temple", "betterdeserttemples:desert_temple",
	"repurposed_structures:pyramid_badlands", "repurposed_structures:pyramid_icy"
]
.forEach(key => {
	const keyHandler = `kubejs:${key.split(":").join("_")}`;

	PlayerEvents.advancement(keyHandler, e => {
		const {player} = e;
		player.revokeAdvancement(keyHandler);
		player.potionEffects.add("mining_fatigue", 20, 2, true, true);	
	})
})