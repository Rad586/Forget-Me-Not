const mining_fatigue = [
	"repurposed_structures:temple_taiga", "repurposed_structures:temple_ocean",
	"betterjungletemples:jungle_temple", "betterdeserttemples:desert_temple",
	"repurposed_structures:pyramid_badlands", "repurposed_structures:pyramid_icy"
]
function miningFatigue(server, manager, player, STRUCTURE_REGISTRY) {
	const registry = server.registryAccess().registry(STRUCTURE_REGISTRY).get();
	if (!mining_fatigue.find(id => manager.getStructureWithPieceAt(
		player.blockPosition(),
		registry.get(new ResourceLocation(id))
	).isValid())) return;

	player.potionEffects.add("mining_fatigue", 20, 2, true, true)
}