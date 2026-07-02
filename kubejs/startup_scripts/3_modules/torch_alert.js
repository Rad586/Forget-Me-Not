global.torch_alert = (player) => {
	if (player.y > 0 || Math.random() > 0.1) return;

	const { level } = player;
	const aabb = player.boundingBox.inflate(32, 2, 32);
	const entities = level.getEntitiesWithin(aabb).filter(e => e.isMonster());

	entities.forEach(entity => {
		const { tags } = entity;
		if (tags.contains("alert") && !entity.target) {
			entity.navigation.moveTo(player, 1);
			entity.potionEffects.add("speed", 20, 0, true, false);
			tags.remove("alert");
		}
		else entity.addTag("alert")
	})
}