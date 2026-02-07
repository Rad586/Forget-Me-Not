ItemEvents.rightClicked("kubejs:inferno", e => {
	const {player, level, server} = e;
	const target = global.advancedRayTraceEntity(player, 12);
	if(!target || !target.isLiving()) return;

	const {x: px, y: py, z: pz} = player;
	const {x: tx, y: ty, z: tz} = target;

	const aabb1 = AABB.of(px-24, py-16, pz-24, px+24, py+16, pz+24);
	const fireball = level.createEntity("minecraft:fireball");
	let executed = false;
	let count = 0;

	function merged_attack(entity, count) {
		entity.discard();

		声声global.sound(player, "bettercombat:double_axe_swing", 0.5 + count/16, 0.5, 0.3);
		global.sound(player, "bosses_of_mass_destruction:minion_summon", 0.2 + count/24, 0.5, 0.3);
		global.particleBurst(entity, "large_smoke", 4, 0);
		
		if(executed) return;
		executed = true;

		server.scheduleInTicks(0, () => {
			global.particleRing("spread", 24, 0, 0, target, "small_flame", 1, 4);
			global.sound(target, "bosses_of_mass_destruction:gauntlet_cast", 0.2 + count/24, 0.9, 0.1);
			global.sound(target, "bosses_of_mass_destruction:gauntlet_laser_charge", 0.5 + count/16, 0.5, 0.1);
			level.spawnParticles("bosses_of_mass_destruction:magic_circle", true, tx, ty+4, tz, 0, 0, 0, 1, 0);


			server.scheduleInTicks(30 + count, () => {
				player.potionEffects.add("kubejs:blast_immunity", 140, 0, false, true);

				fireball.setPosition(tx, ty+4, tz);
				fireball.mergeNbt({Glowing:true, power:[0.0, -0.0045, 0.0], ExplosionPower: count * 0.6 + 2});
				fireball.owner = player;
				fireball.spawn();

				global.sound(target, "bosses_of_mass_destruction:obsidilith_prepare_attack", 0.2 + count/24, 0.5, 0.1);
				global.sound(target, "bosses_of_mass_destruction:gauntlet_idle", 0.2 + count/24, 0.5, 0.1);
				global.sound(target, "bosses_of_mass_destruction:obsidilith_burst", 0.4 + count/16, 0.8, 0.3);
				global.sound(target, "bosses_of_mass_destruction:rage_prepare", 0.5 + count/16, 0.5, 0.1);
			})
		})
	};
	function single_attack(entity) {
		let {x:ex, y:ey, z:ez} = entity;
		if(executed) return;
		executed = true;

		player.potionEffects.add("kubejs:blast_immunity", 40, 0, false, true);

		server.scheduleInTicks(0, () => entity.discard());
		server.scheduleInTicks(10, () => fireball.mergeNbt({power: [(tx - ex) * 0.05, (ty - ey) * 0.05, (tz - ez) * 0.05]}));

		fireball.mergeNbt({
			Glowing: true,
			power:[(ex-tx) * 0.014, (ey-ty) * 0.02, (ez-tz) * 0.014]
		});
		fireball.copyPosition(entity);
		fireball.owner = player;
		fireball.spawn();

		global.sound(player, "block.fire.ambient", 2, 0.6, 1.4);
		global.sound(player, "bosses_of_mass_destruction:comet_shoot", 0.4, 1.8, 0.2);
	};

	level.getEntitiesWithin(aabb1).forEach(entity => {
		if(entity.type != "minecraft:small_fireball" || entity.glowing) return;
		count++;

		if(player.isCrouching()) merged_attack(entity, count);
		else if(!global.throttle(player, 20, "inferno")) single_attack(entity);
	})
})