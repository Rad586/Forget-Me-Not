function explosive_arrow(entity, str) {
	const {level} = entity;
	if(level.isClientSide()) return;
	const {x, y, z} = entity;

	if(entity.isInWater()) {
		level.spawnParticles("large_smoke", true, x, y+0.2, z, 0.1, 0.12, 0.1, 3, 0.06);
		entity.playSound("block.fire.extinguish", 0.16, 2);
	}
	else level.createExplosion(x, y, z).strength(str).explode();
	
	entity.discard();
}