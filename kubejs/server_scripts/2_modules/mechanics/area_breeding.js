ItemEvents.entityInteracted(e => {
	const { target, player, item, hand } = e;
	const { cooldowns } = player;
	if (target.inLove == null ||
		cooldowns.isOnCooldown(item) ||
		!player.isCrouching()
	) return;

	const aabb = target.boundingBox.inflate(0.75, 0, 0.75);
	const entities = e.level
		.getEntitiesWithin(aabb)
		.filter(a => a.inLove == false && a != target);
	if (entities.isEmpty()) return;

	cooldowns.addCooldown(item, 8);
	e.server.scheduleInTicks(1, () => {
		entities
			.stream()
			.limit(3)
			.forEach(a => player.interactOn(a, hand))
	})
})