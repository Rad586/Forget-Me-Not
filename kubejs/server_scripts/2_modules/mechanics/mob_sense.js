function mob_sense(entity) {
	entity.level.getEntitiesWithin(entity.boundingBox.inflate(6, 2, 6)).forEach(entity2 => {
		if(!entity2.isMonster()) return;
		entity2.navigation.moveTo(entity, 1)
	})
}