// const arthropods = ["minecraft:spider", "minecraft:silverfish", "minecraft:bee", "minecraft:endermite"];

// const attack_effects = {
// 	"kubejs.fire_aspect": (attacker, taker, lvl) => {
// 		taker.setSecondsOnFire(lvl + 2)
// 	},
// 	"kubejs.soul_fire_aspect": (attacker, taker, lvl) => {
// 		taker.setSecondsOnFire(lvl + 2);
// 		taker.fireType = "minecraft:soul";
// 	},
// 	"kubejs.poison_aspect": (attacker, taker, lvl) => {
// 		taker.potionEffects.add("minecraft:poison", 60, lvl)
// 	},
// 	"kubejs.freeze_aspect": (attacker, taker, lvl) => {
// 		taker.extinguish();
// 		taker.setTicksFrozen(200 + lvl * 80)
// 	},
// 	"kubejs.knockback_aspect": (attacker, taker, lvl) => {
// 		const view_vec = attacker.getViewVector(1);
// 		taker.knockback(lvl * 0.25 + 0.4, -view_vec.x(), -view_vec.z())
// 	},
// 	"kubejs.smite": (attacker, taker, lvl) => {
// 		if (!taker.isUndead()) return;
// 		taker.attack(attacker, 1.25 * lvl + 1.25)
// 	},
// 	"kubejs.bane_of_arthropods": (attacker, taker, lvl) => {
// 		if (!arthropods.includes(taker.type)) return;
// 		taker.attack(attacker, 1.25 * lvl + 1.25);
// 		taker.potionEffects.add("slowness", 20, 3)
// 	},
// 	"kubejs.impaling": (attacker, taker, lvl) => {
// 		if (!taker.canBreatheUnderwater()) return;
// 		taker.attack(attacker, 1.25 * lvl + 1.25)
// 	},
// 	"kubejs.sweeping_edge": (attacker, taker, lvl) => {
// 		attacker.level.getEntitiesWithin(taker.boundingBox.inflate(Math.min(3, lvl + 1))).forEach((entity2) => {
// 			if (!entity2.isLiving() ||
// 				entity2 == attacker ||
// 				entity2.invulnerableTime > 0
// 			) return;
// 			if (attacker.hasEffect("kubejs:fire_aspect")) {
// 				entity2.setSecondsOnFire(2)
// 			}
// 			else if (attacker.hasEffect("kubejs:soul_fire_aspect")) {
// 				entity2.setSecondsOnFire(2);
// 				entity2.fireType = "minecraft:soul"
// 			};
// 			entity2.attack(attacker, taker.lastDamageTaken * (0.25 + 0.1 * lvl))
// 		});
// 		attacker.setLastHurtMob(taker)
// 	},
// 	"kubejs.transfer_curse": (attacker, taker, lvl) => {
// 		let effects = [];
// 		attacker.activeEffects.forEach(effect => {
// 			const match = effect.getDescriptionId().replace(".", ",").split(",");
// 			if (match[2] == "transfer_curse") return;
// 			effects.push({
// 				modId: match[1],
// 				effectId: match[2],
// 				duration: effect.duration,
// 				amplifier: effect.amplifier
// 			});
// 		});
// 		for (let i = 0; i < lvl + 1; i++) {
// 			if (effects.length > 0) {
// 				let firstEffect = effects[0];
// 				let { modId, effectId } = firstEffect;
// 				taker.potionEffects.add(
// 					`${modId}:${effectId}`,
// 					firstEffect.duration,
// 					firstEffect.amplifier
// 				);
// 				attacker.removeEffect(`${modId}:${effectId}`)
// 			}
// 		}
// 	},
// 	"kubejs.shocking": (attacker, taker, lvl) => {
// 		if (taker.isInWaterOrRain()) global.shocking(attacker, taker, lvl + 2, 3);
// 		else global.shocking(attacker, taker, lvl + 1, 1.5);
// 	},
// 	"kubejs.annoying_curse": (attacker, taker, lvl) => {
// 		if (attacker.isPlayer()) {
// 			attacker.statusMessage = Text.translate(`dialogue.fmn.annoying${Utils.random.nextInt(0, 9)}`)
// 		};
// 		global.sound(attacker, "entity.wither.ambient", 0.5, 1, 0.2);
// 		attacker.level.getEntitiesWithin(entity.boundingBox.inflate(6)).forEach((entity2) => {
// 			if (!entity2.isMonster()) return;
// 			entity2.target = attacker
// 		})
// 	}
// }

// EntityEvents.hurt(e => {
// 	const {source, entity} = e;
// 	if(global.throttle(entity, 9, "eh3") || !entity.isLiving()) return;
// 	e.server.scheduleInTicks(0, () => {
// 		if(["player", "mob"].includes(source.type)) source.immediate.setLastHurtMob(entity);
// 		else entity.setLastHurtByMob(entity);
// 	})

// 	const {source: {immediate: attacker}, entity: taker} = e;
// 	attacker.activeEffects.forEach(effect => {
// 		const behavior = attack_effects[effect.descriptionId.split("effect.")[1]];
// 		if (behavior) behavior(attacker, taker, effect.amplifier)
// 	})
// })