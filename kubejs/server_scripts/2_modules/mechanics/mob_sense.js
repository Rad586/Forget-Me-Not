function mob_sense(entity) {
	const {x, y, z} = entity;
	const r = 6;
	entity.level.getEntitiesWithin(AABB.of(x-r, y-2, z-r, x+r, y+4, z+r)).forEach(entity2 => {
		if(!entity2.isMonster()) return;
		entity2.navigation.moveTo(entity, 1);
	})
}