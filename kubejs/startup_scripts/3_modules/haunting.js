global.monsters2 = [
    "minecraft:enderman", "minecraft:witch"
];
function haunting(entity) {
	const {level} = entity;
	if(level.isClientSide()) return;

	const aabb = entity.boundingBox.inflate(0.5);
	const next_entity = level.getEntitiesWithin(aabb)
		.filter(n => n.isMonster() && n.isAlive())
	if(next_entity.isEmpty()) return;

	const {persistentData: pData} = next_entity.getFirst();
	const {victim} = pData;
	pData.victim = victim == null ? 1 : victim + 1;
	if(pData.victim % 9 || global.haunting == true) return;

	const vex = level.createEntity("minecraft:vex");
	vex.copyPosition(entity);
	vex.mainHandItem = "minecraft:iron_sword";
	vex.spawn();

	const {x, y, z} = entity;
	entity.playSound("minecraft:entity.vex.death")
	level.spawnParticles("minecraft:soul_fire_flame", true, x, y, z, 0.08, 0.08, 0.08, 4, 0);
	level.spawnParticles("minecraft:sculk_soul", true, x, y, z, 0.08, 0.08, 0.08, 3, 0.06);
}