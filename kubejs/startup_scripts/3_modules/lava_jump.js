function lava_jump(entity) {
	const {level} = entity;
	if(level.isClientSide() ||
	   level.dimension != 'minecraft:the_nether' ||
	   global.throttle(entity, 5, 'lava') ||
	   entity.isCrouching()
	) return;

	entity.setMotionY(1.1);
	entity.hurtMarked = true;

	const {x, y, z} = entity;
	global.sound(entity, 'block.lava.extinguish', 0.24, 2, 0.4);
	level.spawnParticles('lava', true, x, y+0.25, z, 0.2, 0.1, 0.2, 4, 0);
	level.spawnParticles('large_smoke', true, x, y+0.5, z, 0.5, 0.5, 0.7, 4, 0.08)
}