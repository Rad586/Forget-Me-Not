EntityEvents.hurt(e => {
	const { entity } = e;
	if (!entity.isLiving() || !entity.isAlive()) return;
	const { server, level, source, damage } = e;

	if(entity.isPlayer()) {
		half_heart_protection(e, entity, damage);

		if (source.actual) {
			on_hit_effect(e, entity, damage);
			underwater(level, entity);
			server.scheduleInTicks(1, () => fight_back_hurt(entity, entity.lastDamageTaken))
		};

		fire_disables_shield(entity);

		player_immune(e, entity, source.type)
	}
	else {
		/* player attack, rune */
	}
})