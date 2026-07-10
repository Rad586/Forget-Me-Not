EntityEvents.hurt(e => {
	const { entity } = e;
	if (!entity.isLiving() || !entity.isAlive()) return;

	const { server, level, source, damage } = e;
	const { actual, type } = source;

	/* player hurt */
	if(entity.isPlayer()) {
		player_immune(e, entity, type);
		half_heart_protection(e, entity, damage);
		fire_disables_shield(entity);

		if (actual) {
			on_hit_effect(e, entity, damage);
			underwater(level, entity);
			server.scheduleInTicks(1, () => fight_back_hurt(entity, entity.lastDamageTaken))
		}
	};

	/* player attack */
	if(actual && actual.isPlayer()) {
		sword_attack(server, level, actual, entity);
		fight_back_attack(actual, damage);
		dizzying(level, entity, damage)
	}
})