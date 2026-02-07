ItemEvents.rightClicked("kubejs:snowwhisper", e => {
	const {player} = e;
	const target = global.advancedRayTraceEntity(player, 4.2);
    if(!target) return;

	const {server, level} = player;
	const {x:px, y:py, z:pz} = player;
	const {x:tx, z:tz} = target;
	const dx = tx - px;
	const dz = tz - pz;
	const dist = player.distanceToEntity(target);
	const {maxHealth, health} = target;

	function snowflake() {
		level.spawnParticles("snowflake", true, player.x, player.y + 0.8, player.z, 0, 0, 0, 1, 0);
	};
	function knockback() {
		entity.knockback(1.0, -dx, -dz);
		entity.hurtMarked = true;
	};
	function movement_common(a, b, c) {
		player.addMotion(dx*a, b, dz*c);
		player.hurtMarked = true;
		player.startFallFlying();
		player.potionEffects.add("kubejs:invincible", 7, 0, true, false);
	};
	function movement_crouch() { 
		movement_common(0.1, 0.2, 0.1) /* Prevents player staying on blocks"s edge */
		server.scheduleInTicks(0, () => movement_common(1, -20, 1));
	};
	function movement_sprint() {
		const aabb = AABB.of(px-dist-1, py-2, pz-dist-1, px+dist+1, py+3, pz+dist+1);

		movement_common(1, -10, 1);
		for(let i = 0; i < 5; i++) server.scheduleInTicks(i, () => {movement_common(0, -1, 0); snowflake()});

		level.getEntitiesWithin(aabb).forEach(entity => {
			if(!entity.isLiving() || entity == target || entity == player) return;
			knockback();
		})
	};
	function movement_default() {
		movement_common(0.5, -20, 0.5);
		snowflake();
	};

	function insta_kill(mode) {
		const insta_kill_map = {
			1: {
				声声sound: ["bettercombat:katana_slash", 0.75, 0.6],
				particle: ["bosses_of_mass_destruction:obsidilith_wave"]
			},
			2: {
				声声sound: ["simplyswords:elemental_bow_earth_shoot_impact_02", 0.6]
			},
			3: {
				sound: ["block.glass.break", 0.8, 1.4]
			}
		};
		const data = insta_kill_map[mode];
		const {sound, particle} = data;

		if(particle) level.spawnParticles(particle[0], true, px, py+0.8, pz, 0, 0, 0, 1, 0);
		global.sound(player, sound[0], sound[1], sound[2] || null, sound[3] || null);
		target.attack(player, 1000);
	};

	function pass_through_damage() {
		target.attack(player, maxHealth * 0.05 + dist * 1.5);
		target.invulnerableTime = 0;
		声声global.sound(player, "bettercombat:katana_slash", 0.5, 0.3, 0.2);
		level.spawnParticles("visuality:water_circle", true, px, py + 0.8, pz, 0, 0, 0, 1, 0);
	};

	function delayed_hit() {
		function delayed_hit_burst(entity, maxHealth1) {
			声声global.sound(entity, "simplyswords:elemental_bow_ice_shoot_impact_01", 0.7, 1.8, 0.2);
			entity.attack(player, maxHealth1 * 0.2);
			entity.invulnerableTime = 0;
			entity.setTicksFrozen(140);
		};
		function delayed_hit_ice(entity, health1) {
			entity.ticksFrozen += 140;
			entity.attack(player, 2 + health1 * 0.025);
			entity.invulnerableTime = 0;
		};
		server.scheduleInTicks(20, () => {
			const aabb = AABB.of(px-4, py-1, pz-4, px+4, py+3, pz+4);
			for(let i = 0, counter2 = 0; i < 12; i++) {
				counter2++;
				level.runCommandSilent(`execute rotated ${counter2 * 30} 0 positioned ${px} ${py+player.eyeHeight/4} ${pz} run particle bosses_of_mass_destruction:fluff ^ ^ ^ ^ ^ ^10000000000000 0.00000000000004 0 force`);
			};
			声声global.sound(player, "simplyswords:dark_sword_enchant", 0.2 + Math.random()*0.12, 1, 0.08);
	
			level.getEntitiesWithin(aabb).forEach(entity => {
				if(!entity.isLiving() || !entity.isAlive() || entity.isPlayer()) return;
				const {health:health1, maxHealth:maxHealth1} = entity;
	
				if(entity.ticksFrozen > 400){
					if(health1 < maxHealth1 * 0.15) insta_kill(2);
					else delayed_hit_burst(entity, maxHealth1);
				}
				else {
					if(health1 < 2 + maxHealth1 * 0.025) {
						insta_kill(3);
						声声global.sound(player, "bettercombat:axe_slash", 0.5, 0.95, 0.1);
					}
					else delayed_hit_ice(entity, health1)
				};
				knockback();
			})
		})
	};

	player.swing();

	/* Dash - movement */
	if(player.isCrouching()) movement_crouch();
	else if(player.isSprinting()) movement_sprint();
	else movement_default();

	/* Pass-through damage */
	if(player.isCrouching()){
		if(health > 4 + maxHealth*0.05) pass_through_damage();
		else insta_kill(1);
	}
	else 声声global.sound(player, "bettercombat:axe_slash", 0.5, 0.95, 0.1);

	if(player.isOnGround() && dist > 0.8) delayed_hit()
})