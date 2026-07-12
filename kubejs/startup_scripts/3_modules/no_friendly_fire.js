global.ally = [
	"guardvillagers:guard", "minecraft:villager",
	"minecraft:snow_golem", "minecraft:chest_boat"
];
function no_friendly_fire(context) {
	if (context.entity.level.isClientSide()) return;
	const { player } = context.damageSource;
	return player && !player.isCrouching()
}