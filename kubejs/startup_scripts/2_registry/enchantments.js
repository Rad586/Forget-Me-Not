/* priority: 2 */
/*Highly inspired by shattered pixel dungeon*/
StartupEvents.registry("enchantment", e => {
	e.create("bounce")
		.checkCompatibility(() => false)
		.wearable()
		.rare()
		.postHurt(
			(user, target, level) => {
				if(ec_check(target, "sec22")) return;
				target.knockback(1, user.x-target.x, user.z-target.z)
			})

	e.create("blessed")
		.checkCompatibility(() => false)
		.wearable()
		.veryRare()
		.untradeable()
		.postHurt(
			(user, target, level) => {
				if(ec_check(user, "sec29")) return;
				user.invulnerableTime += 3;
			})

	e.create("outcast_curse")
		.checkCompatibility(() => false)
		.wearable()
		.veryRare()
		.untradeable()
		.curse()
		.treasureOnly()
		.postHurt(
			(user, target, level) => {
				if (ec_check(user, "sec30")) return;
				user.invulnerableTime -= 4;
			})

	e.create("undead_curse")
		.checkCompatibility(() => false)
		.wearable()
		.veryRare()
		.curse()
		.treasureOnly()
		.postHurt(
			(user, target, level) => {
				if(ec_check(target, "sec37") || Math.random() < 0.04) return;

				user.potionEffects.add("kubejs:zombify", 40, 0, true, true);
				global.particleBurst(user, "large_smoke", 8, 0.06, 0.2);
				global.sound(user, "entity.vex.death", 1.2, 1.07, 0.5);
			})

	e.create("entanglement_curse")
		.checkCompatibility(() => false)
		.wearable()
		.veryRare()
		.curse()
		.treasureOnly()
		.postHurt(
			(user, target, level) => {
				if(ec_check(target, "sec38") || Math.random() < 0.14) return;
				const {potionEffects} = user;

				potionEffects.add("slowness", 60, 2, true, true);
				potionEffects.add("resistance", 60, 3, true, true);

				global.particleBurst(user, "bosses_of_mass_destruction:spore", 3, 0.06, 0.2);
				global.sound(user, "block.grass.place", 0.4, 0.6);
				global.sound(user, "block.gravel.place", 0.5, 0.75);
			})

	e.create("metabolism_curse")
		.checkCompatibility(() => false)
		.wearable()
		.veryRare()
		.untradeable()
		.curse()
		.treasureOnly()
		.postHurt(
			(user, target, level) => {
				if (Math.random() > 0.0417 || !user.isPlayer() || ec_check(user, "sec23")) return;
				user.foodLevel -= 4;

				const { potionEffects } = user;
				const regen = user.getEffect("regeneration");
				if (!regen) {
					potionEffects.add("regeneration", 100, 1, false, true);
				}
				else {
					let duration = Math.min(800, regen.duration + 100);
					potionEffects.add("regeneration", duration, 1, false, true);
				}
			})

	e.create("overflow_curse")
		.checkCompatibility(() => false)
		.wearable()
		.rare()
		.curse()
		.untradeable()
		.postHurt(
			(user, target, level) => {
				if (Math.random() > 0.025 || ec_check(user, "sec14")) return;
				global.sound(user, "block.glass.break", 0.78, 0.8, 0.3);

				const cloud = user.level.createEntity("minecraft:area_effect_cloud");
				cloud.copyPosition(user);
				cloud.mergeNbt({ Radius: 0.5, RadiusPerTick: 0.07, Duration: 40, Effects: [{ Id: random.nextInt(0, 19), Amplifier: 0, Duration: 60 }] });
				cloud.spawn();
			})

	e.create("stench_curse")
		.checkCompatibility(() => false)
		.wearable()
		.rare()
		.curse()
		.treasureOnly()
		.postHurt(
			(user, target, level) => {
				if (Math.random() > 0.015 || ec_check(user, "sec4")) return;

				user.potionEffects.add("poison", 100, 1);
				global.sound(user, "block.fire.extinguish", 0.8, 1, 0.2);

				const cloud = user.level.createEntity("minecraft:area_effect_cloud");
				cloud.copyPosition(user);
				cloud.mergeNbt({ Radius: 2.2, RadiusPerTick: 0.007, Duration: 400, Effects: [{ Id: 19, Amplifier: 0, Duration: 60 }], Particle: "swampier_swamps:swamp_gas" });
				cloud.spawn();
			})

	e.create("anti_entropy_curse")
		.checkCompatibility(() => false)
		.wearable()
		.rare()
		.curse()
		.treasureOnly()
		.postHurt(
			(user, target, level) => {
				if (Math.random() > 0.042 || ec_check(user, "sec5")) return;

				target.setTicksFrozen(280);
				target.extinguish();
				global.sound(target, "minecraft:block.glass.break", 0.6, 1.1, 0.4);
				user.setSecondsOnFire(6);
				global.sound(user, "block.fire.ambient", 2, 1.4, 0.6);
			})

	e.create("annoying_curse")
		.checkCompatibility(() => false)
		.weapon()
		.rare()
		.curse()
		.treasureOnly()
		.postAttack(
			(user, target, level) => {
				if (Math.random() > 0.05 || ec_check(user, "sec2")) return;

				if (user.isPlayer()) user.statusMessage = Text.translate(`dialogue.fmn.annoying${random.nextInt(0, 9)}`);
				global.sound(user, "entity.wither.ambient", 0.5, 1, 0.2);
				user.level.getEntitiesWithin(user.boundingBox.inflate(6)).forEach(entity => {
					if (!entity.isMonster()) return;
					entity.attack(user, 0);
					entity.target = user;
				})
			})

	e.create("transfer_curse")
		.checkCompatibility(() => false)
		.weapon()
		.curse()
		.treasureOnly()
		.veryRare()
		.untradeable()
		.postAttack(
			(user, target, level) => {
				if (ec_check(target, "sec11")) return;

				let effects = [];
				user.activeEffects.forEach(effect => {
					let match = effect.getDescriptionId().replace(".", ",").split(",");
					effects.push({ modId: match[1], effectId: match[2], duration: effect.duration, amplifier: effect.amplifier });
				});
				while (effects.length > 0) {
					let firstEffect = effects[0];
					target.potionEffects.add(`${firstEffect.modId}:${firstEffect.effectId}`, firstEffect.duration, firstEffect.amplifier);
					user.removeEffect(`${firstEffect.modId}:${firstEffect.effectId}`);
				}
			})

	e.create("shocking")
		.checkCompatibility(() => false)
		.weapon()
		.veryRare()
		.postAttack(
			(user, target, level) => {
				if (ec_check(target, "sec32")) return;
				if (target.isInWaterOrRain()) global.shocking(user, target, 7, 3);
				else global.shocking(user, target, 4, 1.5);
			})






	e.create("inferno")
		.weapon()
		.undiscoverable()
		.untradeable()
		.veryRare()
		.postAttack(
			(user, target, level) => {
				if (ec_check(target, "sec9") || target.isAlive()) return;
				const { eyeHeight } = target;

				const small_fireball = user.level.createEntity("minecraft:small_fireball");

				global.particleRing("spread", 12, 0, 0, target, "small_flame", 1, eyeHeight);
				user.potionEffects.add("strength", 80, 0, true, false);

				Utils.server.scheduleInTicks(15, () => {
					声声global.sound(user, "bettercombat:double_axe_swing", 0.6, 0.5, 0.3);

					small_fireball.mergeNbt({ ExplosionPower: Math.min(1.5, target.maxHealth / 20) });
					small_fireball.copyPosition(target);
					small_fireball.y += eyeHeight;
					small_fireball.spawn();
				})
			})

	e.create("golden_cudgel")
		.weapon()
		.undiscoverable()
		.untradeable()
		.veryRare()
		.postAttack(
			(user, target, level) => {
				if (ec_check(target, "sec35")) return;
				const { fallDistance, potionEffects } = user;
				const { maxHealth } = target;
				if (!target.isAlive() || target.health / maxHealth < 0.05) {
					const duration = Math.min(maxHealth, 100)
					potionEffects.add("strength", duration, 0, true, false);
					potionEffects.add("resistance", duration, 0, true, false);
					potionEffects.add("haste", 10, 9, true, false);

					声声global.sound(target, "bettercombat:hammer_slam", 0.8, 1.48);
					global.particleBurst(target, "flame", 12, 0.4);
					global.particleBurst(target, "large_smoke", 8, 0.06, 0.3);
				}
				else {
					if (Client.player.isSprinting()) {
						if (!user.isCrouching()) return;
						const dir = user.lookAngle.scale(1.6);

						user.setDeltaMovement(dir);
						user.motionY += 0.1;
						user.setSprinting(true);
						user.hurtMarked = true;
						user.potionEffects.add("kubejs:invincible", 5, 0, true, false);

						target.knockback(1.6, user.x - target.x, user.z - target.z);
					}
					else if (fallDistance > 0.5) {
						const fall_multiplier = Math.min(fallDistance + 20, 40);
						target.potionEffects.add("weakness", fall_multiplier, 9, true, false);
						target.potionEffects.add("slowness", fall_multiplier, 9, true, false);

						target.target = null;
						user.resetFallDistance();

						global.particleBurst(target, "flame", 12, 0.4);
						global.particleBurst(target, "large_smoke", 8, 0.06, 0.3);
					}
				}
			})

	e.create("greatsword_of_blood")
		.weapon()
		.veryRare()
		.curse()
		.treasureOnly()
		.postAttack(
			(user, target, level) => {
				if (ec_check(target, "sec36") || target.isAlive()) return;

				if (Math.random() < 0.14) user.level.createExplosion(user.x, user.y, user.z).strength(3).damagesTerrain(false).explode();

				if (user.hasEffect("kubejs:shadow_form")) {
					const { duration } = user.getEffect("kubejs:shadow_form");
					user.heal(3);
					user.potionEffects.add("kubejs:shadow_form", Math.min(duration + 50, 100), 0, true, true);

					global.particleBurst(target, blood_particle, 18, 0.3, 0.2);
					global.sound(target, "entity.wither.hurt", 0.2, 0.68, 0.5);
					global.sound(target, "entity.vex.death", 1.6, 1.07, 0.5);
				}
			})
})

	// e.create("mountain_king")
	// 	.checkCompatibility(() => false)
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec1") || user.fallDistance <= 1.5) return;
	// 			target.attack(user, user.fallDistance+target.lastDamageTaken);
	// 			user.resetFallDistance();
	// 		})

		// e.create("dueling")		//Idea from combat enchantments
	// 	.maxLevel(2)
	// 	.weapon()
	// 	.rare()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec6")) return;

	// 			const {x, z} = user;
	// 			声声global.sound(user, "bettercombat:staff_slash", 2, 1.1, 0.2);
	// 			global.particleRing("spread", 18, 0, 0, user, "cloud", 4)
	// 			user.level.getEntitiesWithin(user.boundingBox.inflate(3)).forEach(entity => {
	// 				if(!entity.isLiving() || entity == target) return;
	// 				entity.knockback(user.fallDistance*0.02 + 0.15 + 0.2*level, x-entity.x, z-entity.z);
	// 			})
	// 		})

		// e.create("vulnerability_curse") //#1
	// 	.maxLevel(3)
	// 	.wearable()
	// 	.rare()
	// 	.curse()
	// 	.treasureOnly()
	// 	.postHurt(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec20")) return;
	// 			Utils.server.scheduleInTicks(1, () =>{
	// 				const d = user.lastDamageTaken;
	// 				if(d < 1) return;
	// 				user.attack(target, d+d*level*0.1);
	// 			})
	// 		})

	//Damage change affected
	// e.create("regeneration") //3
	// 	.maxLevel(4)
	// 	.wearable()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postHurt(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec15")) return;
	// 			user.heal(level*0.5);
	// 			Utils.server.scheduleInTicks(5, ()=> {
	// 				if(user.lastDamageTaken < 4) return;
	// 				user.potionEffects.add("regeneration", level*50+50, 1, false, false);
	// 			})
	// 		})

	/////////////////////
	// e.create("giant_slayer")
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec7") || global.throttle(target, 20, "giant_slayer") || target.boundingBox.getSize() < 1.8) return;
	// 			target.attack(user, target.maxHealth*0.03+target.lastDamageTaken);
	// 		})

		// e.create("kinetics")
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec10")) return;

	// 			let v;
	// 			if(user.vehicle && user.vehicle.isLiving()) v = user.vehicle.speed / user.vehicle.defaultMovementSpeed;
	// 			else v = user.speed / user.defaultMovementSpeed;
	// 			const d = Math.abs((3.33*v - 1.83).toFixed(1));
	// 			target.attack(user, d+target.lastDamageTaken);
	// 		})


	// e.create("beheading")
	// 	.maxLevel(2)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec12") || target.health/target.maxHealth > 0.025+level*0.025) return;
	// 			target.attack(user, 100);
	// 		})

	// e.create("beheading_curse")
	// 	.maxLevel(2)
	// 	.wearableHead()
	// 	.rare()
	// 	.curse()
	// 	.treasureOnly()
	// 	.postHurt(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec13") || user.health/user.maxHealth > 0.025+level*0.025) return;
	// 			user.attack(target, 100);
	// 		})



	// e.create("ignition")
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(user, "sec17")) return;

	// 			global.particleRing("spread", 20, 0, level+1, user, "flame", 1);
	// 			user.level.getEntitiesWithin(user.boundingBox.inflate(level+2)).forEach(entity2 => {
	// 				if([user.uuid, target.uuid].includes(entity2.uuid) || entity2.isOnFire()) return;
	// 				entity2.setSecondsOnFire(2);
	// 			})
	// 		})

	// e.create("soul_ignition")
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(user, "sec18")) return;

	// 			global.particleRing("spread", 20, 0, level+1, user, "flame", 1);
	// 			user.level.getEntitiesWithin(user.boundingBox.inflate(level+2)).forEach(entity2 => {
	// 				if([user.uuid, target.uuid].includes(entity2.uuid) || entity2.isOnFire()) return;
	// 				entity2.setSecondsOnFire(2);
	// 				entity2.fireType = "minecraft:soul";
	// 			})
	// 		})

	// e.create("purity_curse")
	// 	.maxLevel(1)
	// 	.wearable()
	// 	.veryRare()
	// 	.untradeable()
	// 	.curse()
	// 	.treasureOnly()
	// 	.postHurt(
	// 		(user, target, level) => {
	// 			if(Math.random() > 0.1 || ec_check(user, "sec19")) return;
	// 			global.sound(user, "block.beacon.power_select", 0.9, 1.8, 0.2);
	// 			user.removeAllEffects();
	// 		})



	// e.create("destruction_curse")
	// 	.maxLevel(1)
	// 	.wearable()
	// 	.veryRare()
	// 	.curse()
	// 	.undiscoverable()
	// 	.treasureOnly()
	// 	.postHurt(
	// 		(user, target, level) => {
	// 			if(ec_check(user, "sec21") || user.isAlive()) return;
	// 			user.level.createExplosion(user.x, user.y, user.z).strength(Math.max(4, user.maxHealth/6.7)).damagesTerrain(false).explode();
	// 		})

	// e.create("lethal")
	// 	.maxLevel(3)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(user, "sec24")) return;

	// 			const a = user.wearableValue;
	// 			if(a >= 14) return;
	// 			target.attack(user, Math.max(1.25, -0.36*a+(2*level))+target.lastDamageTaken);
	// 		})


	// e.create("strike")
	// 	.maxLevel(5)
	// 	.weapon()
	// 	.rare()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec26") || target.isOnGround()) return;
	// 			if(target.isInWater() || target.isInLava()) return;
	// 			target.attack(user, 2.5*level+target.lastDamageTaken);
	// 		})

	// e.create("exorcism")
	// 	.maxLevel(5)
	// 	.weapon()
	// 	.rare()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec27")) return;
	// 			let enchanted = target.wearableSlots.some(armor => armor.isEnchanted());
	// 			if(enchanted) target.attack(user, 2.5*level+target.lastDamageTaken);
	// 		})

	// e.create("luna")
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.veryRare()
	// 	.untradeable()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec31") || !user.level.isNight()) return;
	// 			const i = user.level.moonPhase;
	// 			target.attack(user, Math.min(8, (5*i*i - 40*i + 80) / 9)+target.lastDamageTaken);
	// 		})

	// e.create("destined_death_curse")
	// 	.maxLevel(3)
	// 	.wearable()
	// 	.curse()
	// 	.treasureOnly()
	// 	.veryRare()
	// 	.postHurt(
	// 		(user, target, level) => {
	// 			if(ec_check(user, "sec33") || user.isAlive() || user.hasEffect("kubejs:destined_death_curse")) return;
	// 			user.setHealth(2);
	// 			if(user.isPlayer()) user.closeMenu();
	// 			user.potionEffects.add("kubejs:destined_death_curse", 40*level, 0);
	// 			user.removeEffect("kubejs:purity");
	// 			sound(user, "entity.warden.heartbeat", 1.28, 0.85, 0.2);
	// 			user.level.spawnParticles(blood_particle, true, user.x, user.y+user.eyeHeight/3*2, user.z, 0, 0, 0, 20, 0.15);
	// 		})

	// e.create("abyss_curse")
	// 	.maxLevel(1)
	// 	.weapon()
	// 	.curse()
	// 	.treasureOnly()
	// 	.veryRare()
	// 	.postAttack(
	// 		(user, target, level) => {
	// 			if(ec_check(target, "sec34") || !user.wearableSlots) return;
	// 			let curseTypes = 0;
	// 			const cache = [];

	// 			user.wearableSlots.forEach(armor => {
	// 				armor.enchantments.forEach(id => {
	// 					if(!cache.includes(id)) {
	// 						cache.push(id);
	// 						if(global.Enchantment.get(id).isCurse()) curseTypes++;
	// 					}
	// 				})
	// 			});
	// 			target.attack(user, Math.min(8, curseTypes) + target.lastDamageTaken);
	// 		})