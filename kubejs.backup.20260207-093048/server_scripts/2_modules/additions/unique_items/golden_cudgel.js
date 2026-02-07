
const cudgels = {
    "kubejs:golden_cudgel": ["kubejs:golden_cudgel_large", 1],
    "kubejs:golden_cudgel_large": ["kubejs:golden_cudgel_small", 1.25],
    "kubejs:golden_cudgel_small": ["kubejs:golden_cudgel", 0.75]
};

function golden_cudgel(player, item, key, converted, scale) {
	const {potionEffects, server, level} = player;

	function do_damage(entity, ratio, amount, maxMotionY) {
		ratio = JavaMath.clamp(ratio *scale, 0.07, 0.12);
		let fall_multiplier = JavaMath.clamp((-maxMotionY + 0.078) / 1.75, 1, 1.4);
		let dmg = amount*scale*fall_multiplier;
		let {health, maxHealth} = entity;
		if(health <= dmg || health/maxHealth <= ratio) {
			let duration = Math.min(maxHealth, 100);

			entity.attack(player, 1000);
			potionEffects.add("strength", duration, 0, true, false);
			potionEffects.add("resistance", duration, 0, true, false);
			potionEffects.add("haste", 10*scale, 9, true, false);
			server.scheduleInTicks(0, () => (player.addItemCooldown(key, -100)));

			声声if(!global.throttle(player, 4, "cudgel")) global.sound(entity, "bettercombat:hammer_slam", 0.8*scale, 1.48/scale);
			global.particleBurst(entity, "flame", 12, 0.4);
			global.particleBurst(entity, "large_smoke", 8, 0.06, 0.3);
		}
		else entity.attack(player, dmg);
	};
	function somersault() {
		player.motionY = 1/scale;
		player.hurtMarked = true;
		potionEffects.add("kubejs:soft_landing", 80/scale, 0, true, false);
		potionEffects.add("kubejs:invincible", 12*scale, 0, true, false);
		potionEffects.add("kubejs:somersault", 50*scale, 0);

		声声global.sound(player, "bettercombat:fist_punch", 0.5*scale, 1.1/scale);
		global.particleRing("spread", 12*scale, 0, -0.8, player, "cloud", 3*scale);
	};
	function find_ground() {
		const r1 = 0.8*scale;
		let maxMotionY = -0.078;

		player.removeEffect("kubejs:soft_landing");
		player.removeEffect("kubejs:somersault");
		player.removeEffect("slow_falling");

		server.scheduleInTicks(1, callback => {
			const {x, y, z} = player;
			const crouching = player.isCrouching();
			const crouch_multiplier = crouching ? 1.15 : 1;
			const r2 = crouching ? 5*scale : 3*scale;
			const aabb1 = AABB.of(x-r1, y+0.2, z-r1, x+r1, y-2, z+r1);
			const aabb2 = AABB.of(x-r2, y+0.2, z-r2, x+r2, y-2, z+r2);
			const indexes = Math.random() < 0.4 ? ["minecraft:falling_lava", 0.5, 5, 0]: ["minecraft:lava", 0, 7, 0];
			const onEntity = level.getEntitiesWithin(aabb1).some(entity => entity != player && entity.isLiving());

			if(player.motionY < maxMotionY) maxMotionY = player.motionY;
			player.resetFallDistance();
			potionEffects.add("kubejs:timer", 5, 0, true, false);
			level.spawnParticles(indexes[0], true, x, y+0.2, z, indexes[1], indexes[1], indexes[1], indexes[2], indexes[3]);

			if(!crouching && onEntity) {
				somersault();
				level.getEntitiesWithin(aabb2).forEach(entity => {
					if(entity == player) return;
					do_damage(entity, 0.05, 2, maxMotionY);
					entity.motionY -= 0.2;
				});

				potionEffects.add("kubejs:invincible", 8*scale, 0, true, false);
				player.addItemCooldown(key, 12*scale);
				player.swing();
				return;
			};
			if(Client.player.isOnGround()) {
				let fall_multiplier = JavaMath.clamp((-maxMotionY + 0.078) / 2, 1, 1.4);
				let counter = 0;

				level.getEntitiesWithin(aabb2).forEach(entity => {
					if(!entity.isLiving() || entity == player) return;
					counter++;
					do_damage(entity, crouching ? 0.1 : 0.07, crouching ? 10 : 7, maxMotionY);
					entity.knockback((crouching ? 1.2 : 0.8)*scale*crouch_multiplier*fall_multiplier, x-entity.x, z-entity.z);
					entity.hurtMarked = true;
				});
				player.addItemCooldown(key, (Math.max(80 - counter*10), 40)*scale);
				potionEffects.add("kubejs:invincible", 6*scale*crouch_multiplier, 0, true, false);
				
				player.swing();
				声声global.sound(player, "simplyswords:elemental_sword_earth_attack_03", 0.35*scale*crouch_multiplier, 2/scale/crouch_multiplier);
				level.spawnParticles("flash", true, x, y, z, 0, 0, 0, 1, 0);
				level.spawnParticles("explosiveenhancement:blank_fireball", true, x, y, z, 0, 0, 0, 1, 0);
				global.particleRing("spread", 12*scale*crouch_multiplier.toFixed(0), 0, -0.8, player, "large_smoke", 3*scale*crouch_multiplier);
				global.particleRing("spread", 9, 0, 0.5, player, "cloud", 1*scale);
			}
			else callback.reschedule();
		})
	};
	function isFaceToFace(entity1, entity2) {
		const vec3d = entity1.getViewVector(1);
		const vec3d1 = entity2.getViewVector(1);
		return vec3d.x()*vec3d1.x() + vec3d.z()*vec3d1.z() < -0.5;
	};
	function gun_hua() {
		const {x, y, z} = player;
		const r = 3*scale;
		const aabb = AABB.of(x-r, y-0.2, z-r, x+r, y+2, z+r);

		level.getEntitiesWithin(aabb).forEach(entity => {
			if(entity == player || !entity.isAlive()) return;
			if(entity.isLiving()) {
				let dist = entity.distanceToEntity(player);
				entity.attack(player, 2.5*scale/Math.max(dist, 0.8));
				entity.setMotion((entity.x-x)/dist/10, entity.motionY/2, (entity.z-z)/dist/10);
			}
			else {
				const {inGround} = entity.nbt;
				if(inGround != null && !inGround && !entity.tags.contains("gunhua") && !isFaceToFace(player, entity)) {
					entity.setMotion(0, 0, 0);
					entity.addTag("gunhua");
					global.particleBurst(entity, "flame", 3, 0.2)
					global.sound(player, "entity.blaze.hurt", 0.6*scale, 1.35/scale);
				}
			}
		});

		potionEffects.add("kubejs:parry", 6, 0, true, true);
		player.swing();
		声声global.sound(player, "bettercombat:staff_spin", 0.5*scale+Math.random()*0.3, 1.34/scale);
	}

	if(player.hasEffect("kubejs:somersault")) {
		player.setDeltaMovement(player.lookAngle.scale(2));
		player.hurtMarked = true;	
		find_ground();
	}
	else if(player.isCrouching()) {
		server.scheduleInTicks(0, () => {
			let newItem = Item.of(converted);
			newItem.nbt = item.nbt;
			player.giveInHand(newItem);
		});
		item.count--;
	}
	else {
		if(!player.isOnGround() &&
			Client.player.isJumping() &&
			!player.hasEffect("kubejs:timer") &&
			!player.hasEffect("kubejs:soft_landing")
		) somersault();
		else gun_hua();
	}
}

Object.keys(cudgels).forEach(key => {
	let data = cudgels[key]
	let converted = data[0];
	let scale = data[1];
    ItemEvents.rightClicked(key, e => golden_cudgel(e.player, e.item, key, converted, scale))
})