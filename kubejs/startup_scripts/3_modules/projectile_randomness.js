function projectile_randomness(entity, server) {
	if (Math.random() > 0.5 || entity.tags.contains("randomness")) return;
	const { owner } = entity;
	if (!owner || owner.isPlayer()) return;

	server.scheduleInTicks(0, () => {
		entity.setDeltaMovement(
			entity.deltaMovement.scale(
				0.6 + Math.random() * 0.8
			)
		)
	})

	entity.addTag('randomness')
}