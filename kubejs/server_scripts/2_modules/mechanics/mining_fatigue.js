const mining_fatigue = [
	"repurposed_structures:temple_taiga", "repurposed_structures:temple_ocean",
	"betterjungletemples:jungle_temple", "betterdeserttemples:desert_temple",
	"repurposed_structures:pyramid_badlands", "repurposed_structures:pyramid_icy"
]
function miningFatigue(registry, manager, player, pos) {
	const result = mining_fatigue.find(id => {
		const start = global.structureStartAt(registry, manager, pos, id, true);
		return start && start.isValid()
	});
	if (!result) return;
	player.potionEffects.add("mining_fatigue", 20, 2, true, true)
}