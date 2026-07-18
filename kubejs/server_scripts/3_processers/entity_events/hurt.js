EntityEvents.hurt(e => {
	const { entity } = e;
	if (!entity.isLiving() || !entity.isAlive()) return;
	const { server, level, source, damage } = e;

	let ignore = false;
	if (isNaN(damage)) e.cancel();
	if(damage < 0.01) ignore = true;

	const { actual, type } = source;
	const final_dmg = global.calculateDamage(level, entity, source, damage);
	const actual_hurt = entity.invulnerableTime <= 10;

	/* player hurt */
	if(entity.isPlayer()) {
		player_immune(e, entity, type);
		half_heart_protection(e, entity, final_dmg);
		fire_disables_shield(entity);

		if (actual) {
			parry_effect(level, entity, actual, final_dmg, e);

			if(actual_hurt) {
				trinkets_hurt(level, entity, actual);
				on_hit_effect(e, entity, damage);
				underwater(level, entity);
				fight_back_hurt(entity, final_dmg);
				zombie_leech(actual, final_dmg)
			}
		}
	};

	/* player attack */
	if(actual && actual.isPlayer()) {
		Utils.server.tell(damage);
		if(actual_hurt) {
			trinkets_attack(level, actual, entity);
			main_hand_weapon(level, actual, entity);
			sword_attack(server, level, actual, entity);
			fight_back_attack(actual, final_dmg);
			dizzying(level, entity, final_dmg)
		}
	};

	if(ignore) e.cancel()
})