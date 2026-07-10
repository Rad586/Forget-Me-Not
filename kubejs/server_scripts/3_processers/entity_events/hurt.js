EntityEvents.hurt(e => {
	const { entity } = e;
	if (!entity.isLiving() || !entity.isAlive()) return;

	const { server, level, source, damage } = e;
	const { actual, type } = source;
	const final_dmg = global.calculateDamage(entity, damage);

	/* player hurt */
	if(entity.isPlayer()) {
		player_immune(e, entity, type);
		half_heart_protection(e, entity, final_dmg);
		fire_disables_shield(entity);

		if (actual) {
			on_hit_effect(e, entity, damage);
			underwater(level, entity);
			fight_back_hurt(entity, final_dmg)
		}
	};

	/* player attack */
	if(actual && actual.isPlayer()) {
		/* trinkets() */
		sword_attack(server, level, actual, entity);
		fight_back_attack(actual, damage);
		dizzying(level, entity, final_dmg)
	}
})