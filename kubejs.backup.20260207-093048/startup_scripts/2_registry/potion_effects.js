//priority: 3
function checkWithTime(entity, time) {
	if(!entity || entity.level.isClientSide() || entity.age % time) return true;
}

function onHitCheck(entity) {
	const target = entity.lastHurtMob;
	if(!target || target.hurtTime < 5 || !target.lastHurtByMob || target.lastHurtByMob != entity) return true;
}

function takeHitCheck(entity) {
	const attacker = entity.lastHurtByMob;
	if(entity.hurtTime <= 5 || !attacker || attacker == entity) return true;
}

StartupEvents.registry("mob_effect", e => {
	//Self-applied
	e.create("invincible")
		.beneficial()
		.color(0xF7A400)

	e.create("soft_landing")
		.beneficial()
		.color(0xF4F4B7)
		.effectTick((entity, level) => {	
			if(checkWithTime(entity, 5)) return;

			if(!entity.isOnGround()) entity.potionEffects.add("slow_falling", 6, 0, true, false);
			else entity.removeEffect("kubejs:soft_landing");
	})

	e.create("frost_walker")
		.beneficial()
		.color(0x70A4FC)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;

			if(entity.isOnFire()) {
				entity.removeEffect("kubejs:frost_walker");
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
			else if(!entity.isInWater() && entity.isOnGround()){
				let r = 2+level;
				let {x, y, z} = entity;
				entity.level.runCommandSilent(`fill ${(x-r).toFixed(0)} ${(y-1).toFixed(0)} ${(z-r).toFixed(0)} ${(x+r).toFixed(0)} ${(y-1).toFixed(0)} ${(z+r).toFixed(0)} frosted_ice replace water`);
			}
	})

	e.create("channeling")
		.harmful()
		.color(0x93F5FF)
		.effectTick((entity, level) => {
			if(!entity || entity.level.isClientSide()) return;
			if(global.throttle(entity, 160/(level+1), "channeling")) return;
			if(!entity.level.isThundering() || !entity.block.getCanSeeSky()) return;

			if(entity.isInWater()) { 		//electric conduction
				entity.attack("lightningBolt", 3);
				global.sound(entity, "bosses_of_mass_destruction:energy_shield", 1, 0.8, 0.2);
				entity.potionEffects.add("minecraft:glowing", 40, 0, true, false);
				let i = entity.getEffect("kubejs:channeling").duration + 80;
				entity.potionEffects.add("kubejs:channeling", i, level, true, false);
				
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(Math.min(6, level*2+4))).forEach((entity2) => {
					if(entity2 == entity) return;
					entity2.potionEffects.add("kubejs:channeling", 20, 0, true, false);
					entity2.potionEffects.add("minecraft:glowing", 40, 0, true, false);
				});
			};
			const lightning_bolt = entity.block.createEntity("lightning_bolt");
			lightning_bolt.x += 0.5;
			lightning_bolt.z += 0.5;
			lightning_bolt.spawn();
		})

	e.create("burning")
		.harmful()
		.color(0xD15700)
		.effectTick((entity, level) => {
			if(!entity || entity.level.isClientSide() || entity.isOnFire()) return;

			if(entity.isInWaterOrRain() || entity.hasEffect("kubejs:soul_burning") || entity.getTicksFrozen() > 160) {
				entity.removeEffect("kubejs:burning");
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
			else entity.setSecondsOnFire((level+1)*2);
		})

	e.create("soul_burning")
		.harmful()
		.color(0x47D4EC)
		.effectTick((entity, level) => {
			if(!entity || entity.level.isClientSide() || entity.isOnFire()) return;

			if(entity.isInWaterOrRain() || entity.getTicksFrozen() > 160) {
				entity.removeEffect("kubejs:soul_burning");
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
			else {
				entity.setSecondsOnFire(level+2);
				entity.fireType = "minecraft:soul";
			}
		})

	e.create("ignition")
		.beneficial()
		.color(0xD15700)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 30)) return;

			if(entity.isInWaterOrRain() || entity.hasEffect("kubejs:freeze_aspect") || entity.hasEffect("kubejs:soul_ignition") || entity.getTicksFrozen() > 160) {
				entity.removeEffect("kubejs:ignition");
				entity.setTicksFrozen(0);
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
			else {
				global.particleRing("spread", 20, 0, level+1, entity, "flame", 1);
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(Math.min(5, level+2))).forEach((entity2) => {
					if(!entity2.isOnFire()) entity2.setSecondsOnFire(2);
				})
			}
		})

	e.create("soul_ignition")
		.beneficial()
		.color(0x47D4EC)
		.effectTick((entity, level) => {	
			if(checkWithTime(entity, 30)) return;

			if(entity.isInWaterOrRain() || entity.hasEffect("kubejs:freeze_aspect") || entity.getTicksFrozen() > 160) {
				entity.removeEffect("kubejs:soul_ignition");
				entity.setTicksFrozen(0);
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
			else {
				global.particleRing("spread", 20, 0, level+1, entity, "soul_fire_flame", 1);
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(Math.min(5, level+2))).forEach((entity2) => {
					if(!entity2.isOnFire()) {
						entity2.setSecondsOnFire(2);
						entity2.fireType = "minecraft:soul";
					}
				})
			}
		})

	e.create("repulsion")
		.beneficial()
		.color(0x65CCF2)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 3)) return;

			if(entity.hasEffect("kubejs:pull")){
				entity.removeEffect("kubejs:repulsion");
				global.sound(entity, "minecraft:block.beacon.deactivate", 1, 1, 0.2);
			}
			else {
				let i = level*0.1 + 0.1;
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(2)).forEach((entity2) => {
					if(entity2 == entity) return;
					entity2.addMotion((entity2.x-entity.x)*i, (entity2.y-entity.y)*i, (entity2.z-entity.z)*i);
					entity2.hurtMarked = true;
				})
			}
		})

	e.create("pull")
		.beneficial()
		.color(0x65CCF2)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 3)) return;

			if(entity.hasEffect("kubejs:repulsion")){
				entity.removeEffect("kubejs:pull");
				global.sound(entity, "minecraft:block.beacon.deactivate", 1, 1, 0.2);
			}
			else {
				let i = level*0.1 + 0.1;
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(2)).forEach((entity2) => {
					if(entity2 == entity) return;
					entity2.addMotion((entity.x-entity2.x)*i, (entity.y-entity2.y)*i, (entity.z-entity2.z)*i);
					entity2.hurtMarked = true;
				})
			}
		})

	e.create("aquatic_healing") 	//idea from shattered pixel dungeon
		.beneficial()
		.color(0x3AD6E6)
		.effectTick((entity, level) => {	
			if(checkWithTime(entity, 60) || !entity.isInWaterOrRain()) return;
			entity.heal(1+level);
		})

	e.create("arcane_armor") 	//idea from shattered pixel dungeon
		.beneficial()
		.color(0xD491D0)
		.effectTick((entity, level) => {	
			if(checkWithTime(entity, 30)) return;
			if(entity.absorptionAmount < level+1) entity.absorptionAmount = level+1;
		})

	e.create("caustic_ooze") 	//idea from shattered pixel dungeon
		.harmful()
		.color(0x2D614A)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 40)) return;

			if(entity.isOnFire()){		//firedamp explosion
				entity.level.createExplosion(entity.x, entity.y, entity.z).exploder(entity).strength(2).damagesTerrain(false).explode();
				entity.removeEffect("kubejs:caustic_ooze");
			}
			else if(entity.isInWaterOrRain()){		//water washes off ooze
				global.sound(entity, "item.bucket.empty", 0.68, 1.2, 0.2);
				entity.removeEffect("kubejs:caustic_ooze");
			}
			else if(entity.maxHealth > 100){	//don't apply on bosses
				entity.removeEffect("kubejs:caustic_ooze");
			}
			else entity.attack("magic", 1+level);
		})

	e.create("flame")	//8x faster than entity.boundingBox.inflate(3)!
		.beneficial()
		.color(0xE27907)

	e.create("soul_flame")
		.beneficial()
		.color(0x65CCF2)

	global.thunder = (entity, level) => {
		global.particleRing("gather", 18, 0, 8, entity, "glow_squid_ink", 5);
		global.sound(entity, "block.beacon.activate", 0.58, 1.15, 0.05);
		entity.removeEffect("kubejs:thunderbrand");
		let counter = 0
		Utils.server.scheduleInTicks(20, callback => {
			counter++
			if(counter > 4) thunderbrand(entity, 6+level*2, 1);
			else {
				global.sound(entity, "block.beacon.activate", 1.5+counter*0.1, 1.1+counter*0.1, 0.05);
				global.particleRing("gather", 18, 0, 8-counter*2, entity, "glow_squid_ink", 6-counter);
				callback.reschedule();
			}
		})
	}
	e.create("thunderbrand")
		.beneficial()
		.color(0x9CF1FF)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;
			global.thunder(entity, level);
		})

	e.create("vertigo") //Mob only
		.harmful()
		.color(0xC4C4C4)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;

			if(entity.isPlayer()) entity.removeEffect("kubejs:vertigo");
			else if(!global.throttle(entity, Math.max(5, 30-level*15), "vertigo")) {
				let sign = Math.random() < 0.5 ? -1 : 1;
				let i = Math.max(3, Math.random()*3 * Math.random()*3) * sign;
				let {x, y, z} = entity;
				entity.navigation.moveTo(x+i, y, z+i, 1.0);
			}
		})

	e.create("camouflage")
		.beneficial()
		.color(0x739D5B)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)|| !["oak_leaves", "hanging_roots"].includes(entity.block.material.id)) return;
			entity.potionEffects.add("invisibility", 20, 0, false, false);
		})

	e.create("destined_death_curse")
		.harmful()
		.color(0x530000)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 2)) return;

			if(entity.maxHealth >= 50) {
				global.sound(entity, "block.beacon.power_select", 0.7, 1.8, 0.2);
				entity.removeEffect("kubejs:destined_death_curse");
			}
			else {
				Utils.server.scheduleInTicks(3, () => {
					if(entity.hasEffect("kubejs:destined_death_curse")) return;
					entity.attack("magic", 1000);
					global.sound(entity, "entity.wither.break_block", 0.2, 1, 0.2);
				})
			}
	})

	e.create("rampaging")
		.beneficial()
		.color(0xE05C00)
		.effectTick((entity, level) => {
			if(!entity || entity.level.isClientSide() || entity.isInWater() || entity.isInLava()) return;

			const vec3 = entity.getViewVector(1);
			entity.setMotionX(vec3.x()*(0.5+level*0.05));
			entity.setMotionZ(vec3.z()*(0.5+level*0.05));
			entity.hurtMarked = true;
			entity.potionEffects.add("resistance", 5, 1, true, false);
			entity.level.getEntitiesWithin(entity.boundingBox.inflate(0.75)).forEach(entity2 => {
				if(entity2 == entity || !entity2.isLiving()) return;
				if(entity2.hurtTime == 0) entity2.attack(entity, level*1.5+1.5);
				entity2.knockback(0.4+level*0.15, entity.x-entity2.x, entity.z-entity2.z);
			})
	})

	e.create("rewind")
		.beneficial()
		.color(0xA786FF)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 2)) return;
			const pData = entity.persistentData;
			const {x, y, z} = entity;

			if(!pData.rewind){
				pData.rewind = {dim: entity.level.dimension.toString(), x: x, y: y, z: z};
				global.particleRing("gather", 12, 0, 4, entity, "dragon_breath", 3);
				global.sound(entity, "block.beacon.activate", 2, 1.8, 0.2);
			}
			else {
				let { server } = Utils;
				server.scheduleInTicks(3, () => {
					if(entity.hasEffect("kubejs:rewind") || !pData.rewind || !entity.isAlive()) return;
					global.particleBurst(entity, "minecraft:dragon_breath", 20, 0.2);
					global.sound(entity, "entity.enderman.teleport", 1, 0.8, 0.2);
					entity.teleportTo(pData.rewind.dim, pData.rewind.x, pData.rewind.y, pData.rewind.z, 0, 0);
					pData.rewind = false;

					server.scheduleInTicks(0, () => {
						global.sound(entity, "entity.enderman.teleport", 1, 0.8, 0.2);
						global.particleRing("spread", 18, 0, 0, entity, "dragon_breath", 4);
					})
				})
			}
		})

	e.create("shadow_form")
		.beneficial()
		.color(0x591C5D)
		.effectTick((entity, lvl) => {
			if(!entity || entity.level.isClientSide()) return;
			const {x, eyeY, z, level, potionEffects, age} = entity;

			if(age % 3 == 0) {
				potionEffects.add("invisibility", 5, 0, true, false);
				potionEffects.add("blindness", 65, 0, true, false);
				potionEffects.add("speed", 5, 0, true, false);
				potionEffects.add("strength", 5, 0, true, true);
				potionEffects.add("haste", 5, 0, true, true);
				potionEffects.add("wither", 5, 0, true, false);
				potionEffects.add("kubejs:mind_vision", 25, 0, true, false);
				entity.setSprinting(true);
			};
			if(age % 20 == 0) {
				level.spawnParticles("large_smoke", true, x, eyeY, z, 0.3, 0.8, 0.3, 28, 0);
				level.spawnParticles("witch", true, x, eyeY+0.05, z, 0.08, 0.08, 0.08, 8, 0);
				global.sound(player, "entity.warden.heartbeat", 0.5, 0.64);
			}
		})

	e.create("timer")
		.beneficial()
		.color(0xF2DD80)

	e.create("timer2")
		.beneficial()
		.color(0xF2DD80)

	//On taking hit
	e.create("thorns")
		.beneficial()
		.color(0x39741F)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5) || takeHitCheck(entity)) return;
			const attacker = entity.lastHurtByMob;
			attacker.attack("thorns", random.nextInt(1, 5));
		})

	e.create("vulnerability")
		.harmful()
		.color(0xC7C2A1)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5) || takeHitCheck(entity)) return;
			let i = entity.lastDamageTaken;
			entity.attack(entity.lastHurtByMob, i*(level*0.1+0.1)+entity.lastDamageTaken);
		})

	e.create("bounce")
		.beneficial()
		.color(0xFFAFFF)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5) || takeHitCheck(entity)) return;
			const attacker = entity.lastHurtByMob;
			attacker.knockback(0.75+0.25*level, entity.x-attacker.x, entity.z-attacker.z);
		})

	e.create("metabolism_curse")
		.harmful()
		.color(0x745499)
		.effectTick((entity, level) => {
			if(Math.random() > 0.2 || checkWithTime(entity, 5)) return;

			if(!entity.isPlayer()) entity.removeEffect("kubejs:metabolism_curse");
			else if(!takeHitCheck(entity)){
				entity.foodLevel -= 2*level+2;
				entity.potionEffects.add("regeneration", 50*level+50, 1, true, false);
			}
		})

	e.create("stench_curse")
		.harmful()
		.color(0x83CE59)
		.effectTick((entity, level) => {
			if(Math.random() > 0.06 || checkWithTime(entity, 5) || takeHitCheck(entity)) return;

			entity.potionEffects.add("poison", 100, 1);
			global.sound(entity, "block.fire.extinguish", 0.8, 1, 0.2);

			const cloud = entity.level.createEntity("minecraft:area_effect_cloud");
			cloud.copyPosition(entity);
			cloud.mergeNbt(`{Radius:2.2f,RadiusPerTick:0.007f,Duration:100,Effects:[{Id:19,Amplifier:0b,Duration:60}],Particle:"swampier_swamps:swamp_gas"}`);
			cloud.spawn();
		})

	e.create("anti_entropy_curse")
		.harmful()
		.color(0xC19EC1)
		.effectTick((entity, level) => {
			if(Math.random() > 0.168 || checkWithTime(entity, 5) || takeHitCheck(entity)) return;

			const attacker = entity.lastHurtByMob;
			attacker.setTicksFrozen(280);
			attacker.extinguish();
			global.sound(attacker, "minecraft:block.glass.break", 0.6, 1.1, 0.4);
			entity.setSecondsOnFire(6);
			global.sound(entity, "block.fire.ambient", 2, 1.4, 0.6);
		})

	e.create("beheading_curse")
		.harmful()
		.color(0x962D2A)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5) || takeHitCheck(entity)) return;
			
			const attacker = entity.lastHurtByMob;
			if(attacker.health/attacker.maxHealth > 0.025+level*0.025) return;
			entity.attack(attacker, 100);
		})

	e.create("overflow_curse")
		.harmful()
		.color(0xC300BF)
		.effectTick((entity, level) => {
			if(Math.random() > 0.08 || checkWithTime(entity, 5) || takeHitCheck(entity)) return;

			global.sound(entity, "block.glass.break", 0.78, 0.8, 0.3);
			const cloud = entity.level.createEntity("minecraft:area_effect_cloud");
			cloud.copyPosition(entity);
			cloud.mergeNbt(`{Radius:0.5f,RadiusPerTick:0.07f,Duration:40,Effects:[{Id:${random.nextInt(0, 19)},Amplifier:0b,Duration:60}]}`);
			cloud.spawn();
		})

	e.create("blessed")
		.beneficial()
		.color(0xFFE811)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;
			if(entity.hasEffect("kubejs:outcast_curse")){
				entity.removeEffect("kubejs:blessed");
				global.sound(entity, "minecraft:block.beacon.deactivate", 1, 1, 0.2);
			}
			else if(!takeHitCheck(entity)){
				if(entity.invulnerableTime <= 20) entity.invulnerableTime += level+1;
			}
		})

	e.create("outcast_curse")
		.harmful()
		.color(0x941F20)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5) || takeHitCheck(entity)) return;
			entity.invulnerableTime -= level+1;
		})

	e.create("parry")
		.beneficial()
		.color(0xED7D04)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5) || takeHitCheck(entity)) return;
			const {potionEffects, lastHurtByMob, x, eyeY, z} = entity;
			entity.removeEffect("kubejs:parry");

			potionEffects.add("haste", 15, 3);
			lastHurtByMob.knockback(1.2, x-lastHurtByMob.x, z-lastHurtByMob.z);
			potionEffects.add("strength", 15, 1);

			entity.addItemCooldown("kubejs:golden_cudgel", 40);
			entity.addItemCooldown("kubejs:golden_cudgel_large", 40);
			entity.addItemCooldown("kubejs:golden_cudgel_small", 40);

			global.sound(entity, "entity.blaze.hurt", 0.6, 1.35);
			entity.level.spawnParticles("flash", true, x, eyeY, z, 0, 0, 0, 1, 0);
		})
	

	//On hit
	e.create("fire_aspect")
		.beneficial()
		.color(0xE27907)
		.effectTick((entity, lvl) => {
			if(entity.age % 4) return;
			if (entity.isInWaterOrRain() ||
				entity.hasEffect("kubejs:freeze_aspect") ||
				entity.hasEffect("kubejs:soul_fire_aspect") ||
				entity.getTicksFrozen() > 160
			) {
				entity.removeEffect("kubejs:fire_aspect");
				entity.setTicksFrozen(0);
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
		})

	e.create("soul_fire_aspect")
		.beneficial()
		.color(0x65CCF2)
		.effectTick((entity, lvl) => {
			if (entity.age % 4) return;
			if (entity.isInWaterOrRain() ||
				entity.hasEffect("kubejs:freeze_aspect") ||
				entity.getTicksFrozen() > 160
			) {
				entity.removeEffect("kubejs:soul_fire_aspect");
				entity.setTicksFrozen(0);
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
		})

	e.create("poison_aspect")
		.beneficial()
		.color(0x64A63A)

	e.create("freeze_aspect")
		.beneficial()
		.color(0xD15700)
		.effectTick((entity, lvl) => {
			if (entity.age % 4) return;
			if (entity.isOnFire()) {
				entity.removeEffect("kubejs:freeze_aspect");
				global.sound(entity, "block.fire.extinguish", 0.8, 1.8, 0.2);
			}
		})

	e.create("knockback_aspect")
		.beneficial()
		.color(0x6D6D6D)

	e.create("smite")
		.beneficial()
		.color(0xFFFDD0)

	e.create("bane_of_arthropods")
		.beneficial()
		.color(0x7D0902)

	e.create("impaling")
		.beneficial()
		.color(0x6EB1FF)

	e.create("sweeping_edge")
		.beneficial()
		.color(0xE9E9E9)

	// e.create("mountain_king")
	// 	.beneficial()
	// 	.color(0x6868A5)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || entity.fallDistance <= 1.5 || onHitCheck(entity)) return;
	// 		const target = entity.lastHurtMob;
	// 		target.attack(entity, entity.fallDistance*0.5+level*0.25 + target.lastDamageTaken);
	// 		entity.resetFallDistance();
	// 	})

	// e.create("dueling")
	// 	.beneficial()
	// 	.color(0xF0DCB7)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;

	// 		声声global.sound(entity, "bettercombat:staff_slash", 2, 1.1, 0.2);
	// 		global.particleRing("spread", 18, 0, 0, entity, "cloud", 4)
	// 		entity.level.getEntitiesWithin(entity.boundingBox.inflate(3)).forEach((entity2) => {
	// 			if(!entity2.isLiving() || entity2 == entity.lastHurtMob) return;
	// 			entity2.knockback(entity.fallDistance*0.02 + 0.15 + 0.2*level+0.2, x-entity2.x, z-entity2.z);
	// 		})
	// 	})

	// e.create("giant_slayer")
	// 	.beneficial()
	// 	.color(0xD52C2E)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;
			
	// 		const target = entity.lastHurtMob;
	// 		if(target.boundingBox.getSize() < 1.8) return;
	// 		target.attack(entity, target.maxHealth*0.015+level*0.015 + target.lastDamageTaken);
	// 	})

	// e.create("kinetics")
	// 	.beneficial()
	// 	.color(0x89F788)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;
			
	// 		const target = entity.lastHurtMob;
	// 		let v;
	// 		if(entity.vehicle && entity.vehicle.isLiving()) v = entity.vehicle.speed / entity.vehicle.defaultMovementSpeed;
	// 		else v = entity.speed / entity.defaultMovementSpeed;
	// 		let d = Math.abs((3*v - 1.83).toFixed(1));
	// 		target.attack(entity, d+target.lastDamageTaken);
	// 	})

	e.create("transfer_curse")
		.harmful()
		.color(0xF0DCB7)

	// e.create("beheading")
	// 	.beneficial()
	// 	.color(0xAF0000)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;
			
	// 		const target = entity.lastHurtMob;
	// 		if(target.health/target.maxHealth > 0.025+level*0.025) return;
	// 		target.attack(entity, 100);
	// 	})

	// e.create("lethal")
	// 	.beneficial()
	// 	.color(0xFF2323)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;

	// 		let a = entity.armorValue;
	// 		const target = entity.lastHurtMob
	// 		if(a >= 14) return;
	// 		target.attack(entity, Math.min(1.25, -0.24*a+(2*level+2)) + target.lastDamageTaken);
	// 	})

	// e.create("strike")
	// 	.beneficial()
	// 	.color(0xFCC25C)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;

	// 		const target = entity.lastHurtMob;
	// 		if(target.isOnGround() || target.isInWater() || target.isInLava()) return;
	// 		target.attack(entity, 2*level+2+target.lastDamageTaken);
	// 	})

	// e.create("exorcism")
	// 	.beneficial()
	// 	.color(0xA74CFF)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || onHitCheck(entity)) return;

	// 		const target = entity.lastHurtMob;
	// 		let enchanted = target.armorSlots.some(armor => armor.isEnchanted());
	// 		if(enchanted) target.attack(entity, 2*level+2 + target.lastDamageTaken);
	// 	})

	// e.create("luna")
	// 	.beneficial()
	// 	.color(0xCBD3E4)
	// 	.effectTick((entity, level) => {
	// 		if(checkWithTime(entity, 5) || !entity.level.isNight() || onHitCheck(entity)) return;

	// 		const target = entity.lastHurtMob;
	// 		let i = entity.level.moonPhase;
	// 		target.attack(entity, Math.min(4, (5*i*i - 40*i + 80) / 9)+target.lastDamageTaken);
	// 	})

	e.create("shocking")
		.beneficial()
		.color(0xF0DCB7)

	e.create("annoying_curse")
		.harmful()
		.color(0xB10202)


	//After death
	e.create("oozing")
		.harmful()
		.color(0x89D571)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 10)) return;

			Utils.server.scheduleInTicks(11, () => {
				if(entity.deathTime != 20) return;
				global.sound(entity, "block.slime_block.break", 2, 1, 0.3);

				const cloud = entity.level.createEntity("minecraft:area_effect_cloud");
				cloud.copyPosition(entity);
				cloud.mergeNbt(`{Radius:1f,RadiusPerTick:0.15f,Duration:${(level+1)*20},Effects:[{Id:2,Amplifier:0b,Duration:20}],Particle:"item_slime",ReapplicationDelay:10}`);
				cloud.spawn();
			})
		})

	e.create("vanishing_curse")
		.harmful()
		.color(0x506765)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 10)) return;

			Utils.server.scheduleInTicks(11, () => {
				if(entity.deathTime != 20) return;
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(Math.min(4, level+2))).forEach((entity2) => {
					if (entity2.type == "minecraft:item") return;
					entity2.kill();
					entity.level.spawnParticles("minecraft:cloud", true, entity2.x, entity2.y+0.25, entity2.z);
				})
			})
		})

	e.create("loyalty")
		.beneficial()
		.color(0x9F3FD3)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 10)) return;
			const attacker = entity.lastHurtByMob;
			if(!attacker) return;

			Utils.server.scheduleInTicks(11, () => {
				if(entity.deathTime != 20) return;
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(Math.min(4, level+2))).forEach((entity2) => {
					if (entity2.type == "minecraft:item") return;
					entity2.absMoveTo(attacker.x, attacker.y, attacker.z);
					entity.level.spawnParticles("minecraft:dragon_breath", true, entity2.x, entity2.y+0.25, entity2.z);
				})
			})
		})

	e.create("destruction_curse")
		.harmful()
		.color(0x5E2323)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 10)) return;

			Utils.server.scheduleInTicks(11, () => {
				if(entity.deathTime != 20) return;
				entity.level.createExplosion(entity.x, entity.y, entity.z).strength(Math.min(3, entity.maxHealth/6.7)).damagesTerrain(false).explode();
			})
		})

	e.create("combo")
		.beneficial()
		.color(0x868A8B)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;
			if(!takeHitCheck(entity)){
				entity.removeEffect("kubejs:combo");
				global.sound(entity, "block.fire.extinguish", 0.8, 1, 0.2);
			}
			else if(!onHitCheck(entity)){
				const target = entity.lastHurtMob;
				const lastdmg = target.lastDamageTaken;
				if(level >= 9){
					if(target.health/target.maxHealth < 0.12) target.attack(entity, 100);
					else target.attack(entity, lastdmg + 8);
					global.particleBurst(target, blood_particle, 14, 0.1);
					global.sound(entity, "entity.firework_rocket.blast", 0.5, 0.5, 0.2);
					声声global.sound(entity, "bettercombat:fist_punch", 0.8, 1.2, 0.2);
					entity.removeEffect("kubejs:combo");
					entity.potionEffects.add("kubejs:combo", 120, 0);
				}
				else {
					entity.potionEffects.add("kubejs:combo", 60, level+1);
					target.attack(entity, Math.min(20, lastdmg + lastdmg*(level*0.1 + 0.1)));
				}
			}
		})

	//Player only
	e.create("blast_immunity")
		.beneficial()
		.color(0xD87F2B)

	e.create("binding_curse") //this is SO hilarious
		.harmful()
		.color(0x4B2163)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, Math.max(1, 2-level))) return;

			if(!entity.isPlayer()) entity.removeEffect("kubejs:binding_curse");
			else {
				let pData = entity.persistentData;
				if(!pData.slot || pData.slot == -1) pData.slot = entity.selectedSlot;
				entity.setSelectedSlot(pData.slot);
				Utils.server.scheduleInTicks(2, () => {if(!entity.hasEffect("kubejs:binding_curse")) pData.slot = -1});
			}
		})

	e.create("mind_vision") //it could be for mobs, but that would be too chaotic. idea from shattered pixel dungeon
		.beneficial()
		.color(0xECAAD9)
		.effectTick((entity, level) => {	
			if(checkWithTime(entity, 20)) return;

			if(!entity.isPlayer()) entity.removeEffect("kubejs:mind_vision");
			else {
				entity.level.getEntitiesWithin(entity.boundingBox.inflate(Math.min(8, 6+2*level))).forEach((entity2) => {
					if(!entity2.isLiving()) return;
					entity2.potionEffects.add("glowing", 21, 0, true, false);
				})
			}
		})

	e.create("charging") 	//idea from shattered pixel dungeon
		.beneficial()
		.color(0xF7C956)
		.effectTick((entity, level) => {
			if(!entity || entity.level.isClientSide()) return;

			if(!entity.isPlayer()) entity.removeEffect("kubejs:charging");
			else {
				let item = entity.mainHandItem;
				if(!entity.cooldowns.isOnCooldown(item) || global.throttle(entity, Math.max(2, 10-level*2), "charging")) return;
				entity.cooldowns.removeCooldown(item);
			}
		})

	e.create("somersault")
		.beneficial()
		.color(0xE0E0E0)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 4)) return;
			if(!entity.isPlayer() || entity.isOnGround()) {
				entity.removeEffect("kubejs:somersault");
				return;
			};
			const {x, y, z} = entity;
			entity.level.spawnParticles("cloud", true, x, y-0.2, z, 0.6, 0, 0.6, 5, 0);
		})

	e.create("purity")
		.beneficial()
		.color(0xEDEDED)

	e.create("zombify")
		.beneficial()
		.color(0x4D7437)

	global.biomeList = {
		"hot": {
			biomes: {
				"minecraft:desert":1, "minecraft:badlands":1,
				"terralith:desert_spires":1, "terralith:desert_canyon":1,
				"terralith:volcanic_peaks":1, "terralith:ancient_sands":1,
	
				"incendium:volcanic_deltas":2, "incendium:toxic_heap":2,
				"incendium:quartz_flats":2, "incendium:infernal_dunes":2,
				"minecraft:nether_wastes":2, "minecraft:basalt_deltas":2
			},
			action: player => {
				player.unlockAdvancement("kubejs:hot_biome");
				player.setSecondsOnFire(1);
			},
			criteria: player => {
				const caving = player.level.dimension == "minecraft:overworld" && player.y < 24;
				if(
					player.armorValue <= 15 || 
					player.isInWaterOrRain() || 
					player.ticksFrozen > 0 || 
					global.isNearHome(player, 64) || 
					player.hasEffect("minecraft:fire_resistance") ||
					caving
				) return true;
				return false;
			}
		},
		"cold": {
			biomes: {
				"minecraft:frozen_peaks":2, "minecraft:ice_spikes":2,
				"terralith:glacial_chasm":2, "terralith:frozen_cliffs":2,
				"terralith:haze_mountain":1, "minecraft:jagged_peaks":1,
				"minecraft:soulsand_valley":1, "incendium:weeping_valley":1
			},
			action: player => {
				player.unlockAdvancement("kubejs:cold_biome");
				player.ticksFrozen = Math.min(200, player.ticksFrozen + 80);
			},
			criteria: player => {
				const caving = player.level.dimension == "minecraft:overworld" && player.y < 24;
				if(
					global.checkFullArmor(player) ||
					player.isSprinting() ||
					player.isOnFire() ||
					global.isNearHome(player, 64) ||
					caving
				) return true;
				return false;
			}
		}
	};
	function renderBar(player, percent) {
		percent *= 0.01;
		const color = percent >= 0 ? "red": "LIGHT_BLUE_DYE";
    	player.paint({renderBar: {visible: false}});

		if(percent == 0) return;
    	player.paint({
			renderBar: {
				type: "rectangle",
				color: color,
				alignY: "bottom",
				x: "$screenW/2 - 90",
				y: -25,
				w: 180 * Math.abs(percent),
				h: 1,
				draw: "ingame",
				visible: true
			}
		})
	};
	function temp_effect(entity, level, sign) {
		level += 1;
		const {persistentData: pData} = entity;
		const value = (0.05*level)*sign;
		const percent = JavaMath.clamp(((pData.temp || value) + value), -100, 100);

		pData.temp = percent;
		renderBar(entity, percent);
		Utils.server.scheduleInTicks(5, () => {
			if(entity.hasEffect("kubejs:hot") || entity.hasEffect("kubejs:cold")) return;
			entity.potionEffects.add("kubejs:normal_temp", 20, 0, true, false);
		});

		if(entity.age % 20) return;
		if(percent >= 100) global.biomeList["hot"].action(entity);
		else if(percent <= -100) global.biomeList["cold"].action(entity);
	};
	e.create("hot")
		.beneficial()
		.color(0xD87F2B)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;
			if(!entity.isPlayer()) {
				entity.removeEffect("kubejs:hot");
				return;
			};
			temp_effect(entity, level, 1);
		});
	e.create("cold")
		.beneficial()
		.color(0xD87F2B)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;
			if(!entity.isPlayer()) {
				entity.removeEffect("kubejs:cold");
				return;
			};
			temp_effect(entity, level, -1);
		});
	e.create("normal_temp")
		.beneficial()
		.color(0xD87F2B)
		.effectTick((entity, level) => {
			if(checkWithTime(entity, 5)) return;
			if(!entity.isPlayer() ||
				entity.hasEffect("kubejs:hot") ||
				entity.hasEffect("kubejs:cold")
			) {
				entity.removeEffect("kubejs:normal_temp");
				return;
			};

			const {persistentData: pData, potionEffects} = entity;
			const {temp} = pData;
			const value = (0.825*(level+1)) * (temp > 0 ? -1 : 1);
			const percent = Math.abs(temp) - (0.825*(level+1)) < 0 ? 0 : (temp == null ? value : temp+value);

			pData.temp = percent;
			renderBar(entity, percent);
			if(pData.temp != 0) potionEffects.add("kubejs:normal_temp", 11, 0, true, false);
		})

	e.create("bad_omen_check")
		.beneficial()
		.color(0xD87F2B)
		.effectTick((entity, level) => {
			if(!entity || entity.level.isClientSide()) return;
			entity.removeEffect("kubejs:bad_omen_check");
			if(!Utils.server.persistentData.nether_stage) entity.removeEffect("bad_omen");
		})

	e.create("fight_back")
		.beneficial()
		.color(0xD80000)

	e.create("dragon_powered")
		.beneficial()
		.color(0xD87F2B)
		.effectTick((entity, lvl) => {
			const {level} = entity;
			if(
				!entity ||
				level.isClientSide() ||
				!entity.isPlayer() ||
				!entity.isCrouching()
			) return;
		
			const dragon_breath = level.createEntity("kubejs:dragon_breath");
			dragon_breath.copyPosition(entity);
			dragon_breath.setY(entity.eyeY - 0.25);
			dragon_breath.setDeltaMovement(entity.lookAngle.scale(0.74));
			dragon_breath.spawn();
		
			global.sound(entity, "block.fire.extinguish", 0.02, 2, 0.1)
		})

	e.create("midas_curse")
		.harmful()
		.color(0xFFC300)
})

function potionRegist(e, id, durationInSeconds){
	e.createCustom(id, () => {
		return new $PotionBuilder(id)
		.effect(`kubejs:${id}`, durationInSeconds * 20, 0)
		.createObject()
	})
};
StartupEvents.registry("potion", e => {
	potionRegist(e, "blast_immunity", 5);
	potionRegist(e, "invincible", 5);
	potionRegist(e, "soft_landing", 30);
	potionRegist(e, "thorns", 30);
	potionRegist(e, "frost_walker", 60);
	potionRegist(e, "channeling", 10);
	potionRegist(e, "oozing", 120);
	potionRegist(e, "burning", 10);
	potionRegist(e, "soul_burning", 8);
	potionRegist(e, "fire_aspect", 120);
	potionRegist(e, "soul_fire_aspect", 90);
	potionRegist(e, "poison_aspect", 120);
	potionRegist(e, "freeze_aspect", 120);
	potionRegist(e, "knockback_aspect", 120);

	potionRegist(e, "binding_curse", 20);
	potionRegist(e, "pull", 40);
	potionRegist(e, "repulsion", 40);
	potionRegist(e, "flame", 120);
	potionRegist(e, "soul_flame", 90);
	potionRegist(e, "ignition", 60);
	potionRegist(e, "soul_ignition", 40);
	potionRegist(e, "vanishing_curse", 180);
	potionRegist(e, "loyalty", 180);
	potionRegist(e, "sweeping_edge", 120);
	potionRegist(e, "bane_of_arthropods", 120);
	potionRegist(e, "smite", 120);

	potionRegist(e, "caustic_ooze", 180);
	potionRegist(e, "aquatic_healing", 180);
	potionRegist(e, "mind_vision", 120);
	potionRegist(e, "arcane_armor", 45);
	potionRegist(e, "vulnerability", 60);
	potionRegist(e, "purity", 90);
	potionRegist(e, "charging", 30);
	potionRegist(e, "impaling", 30);

	potionRegist(e, "thunderbrand", 5);
	potionRegist(e, "vertigo", 20);

	potionRegist(e, "camouflage", 270);
	potionRegist(e, "annoying_curse", 120);
	potionRegist(e, "bounce", 120);
	potionRegist(e, "metabolism_curse", 120);
	potionRegist(e, "stench_curse", 120);
	potionRegist(e, "anti_entropy_curse", 90);
	potionRegist(e, "beheading_curse", 150);
	potionRegist(e, "overflow_curse", 120);
	potionRegist(e, "blessed", 90);
	potionRegist(e, "outcast_curse", 90);
	// potionRegist(e, "affection", 90);
	// potionRegist(e, "mountain_king", 120);
	// potionRegist(e, "dueling", 120);
	// potionRegist(e, "giant_slayer", 120);
	// potionRegist(e, "kinetics", 120);
	potionRegist(e, "transfer_curse", 120);
	// potionRegist(e, "beheading", 150);
	// potionRegist(e, "lethal", 120);
	// potionRegist(e, "challenger", 120);
	// potionRegist(e, "strike", 120);
	// potionRegist(e, "exorcism", 120);
	// potionRegist(e, "breach", 120);
	// potionRegist(e, "luna", 120);
	potionRegist(e, "shocking", 60);
	potionRegist(e, "destruction_curse", 90);

	potionRegist(e, "destined_death_curse", 60);
	potionRegist(e, "combo", 12);
	potionRegist(e, "rampaging", 10);
	potionRegist(e, "rewind", 30);
	potionRegist(e, "midas_curse", 40);
})