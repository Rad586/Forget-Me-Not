function projectile_randomness(entity, server) {
	if (Math.random() > 0.5) return;
	const { owner } = entity;
	if (!owner || owner.isPlayer()) return;

	server.scheduleInTicks(1, () => {
		entity.setDeltaMovement(
			entity.deltaMovement.scale(
				0.6 + Math.random() * 0.8
			)
		)
	})
}