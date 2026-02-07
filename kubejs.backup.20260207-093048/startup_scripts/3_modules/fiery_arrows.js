function fiery_arrows(entity) {
	const { level, age, nbt } = entity;
	if (age % 3 || !entity.isOnFire()) return;

	if (nbt.inGround) {
		entity.extinguish();
		level.spawnParticles(
			"large_smoke", true, 
			entity.x, entity.eyeY + 0.2, entity.z, 
			0.1, 0.12, 0.1, 
			3, 0.06
		);
		entity.playSound("block.fire.extinguish", 0.16, 2);
		return;
	};

	const fireMap = {
		"minecraft:": "flame",
		"minecraft:soul": "soul_fire_flame"
	};
	level.spawnParticles(
		fireMap[entity.fireType], true, 
		entity.x, entity.eyeY, entity.z, 
		0, 0, 0, 
		random.nextInt(1, 4), 0.072
	);
}