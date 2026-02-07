global.ally = [
	"guardvillagers:guard", "minecraft:villager",
	"minecraft:snow_golem",
	"minecraft:chest_boat"
];
function no_friendly_fire(context) {
	const player = context.damageSource.getPlayer();
	return player != null && !player.isCrouching()
}