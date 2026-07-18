EntityJSEvents.modifyEntity(e => {
	const { server } = Utils;
	if (!server) return;

	/* may prevent memory leak */
	const {
		ally, dimensionalMobs, projectiles,
		preys, evolutionMap, pets,
		released_fish, fireballs,
		spiders, skeletons,
		attackable_pets, creepers, zombies,
		arrows, raiders
	} = global;
	if (!zombies) return;

	zombies.forEach(zombie =>
		e.modify(zombie, modifyBuilder =>
			modifyBuilder
				.canDisableShield(entity => armed_zombie(entity))
				.onAddedToWorld(entity => {
					if (!entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					mounted_mobs(entity, "minecraft:creeper")
					zombie_thrower(entity)
					no_baby(entity)
					remove_enchantments(entity)

					entity.addTag("kjsed")
				})
				.onHurtTarget(context => fierce_zombies(context.entity))
		)
	)

	e.modify("minecraft:item", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				no_flying_item(entity);
				mindful_death(entity);

				entity.addTag("kjsed")
			})
			.canChangeDimensions(entity => portal_conversion(entity))
			.onFall(context => {
				const { distance, entity } = context, { server } = entity;
				if (!server) return;
				auto_plant(entity, distance)
			})
	)

	e.modify("minecraft:potion", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				deadlier_witch(entity);

				entity.addTag("kjsed")
			})
	)

	e.modify("minecraft:slime", modifyBuilder =>
		modifyBuilder
			.onFall(context => slime_regen(context))
	)

	e.modify("minecraft:pillager", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				pillager_spawn(entity)

				entity.addTag("kjsed")
			})
			.onHurt(context => {
				const { entity } = context;
				if (entity.level.isClientSide()) return;
				if (!context.damageSource.actual) return;

				illusioner(entity);
				loot_goat_horn(entity);
				sai(entity);
			})
			.onHurtTarget(context => pillager_skill(context))
	);
	e.modify("minecraft:vindicator", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				entity.setMainHandItem("minecraft:iron_sword")

				entity.addTag("kjs")
			})
			.onHurtTarget(context => pillager_skill(context))
			.onHurt(context => {
				if (!context.damageSource.actual) return;
				sai(context.entity);
			})
	)

	e.modify("minecraft:piglin", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				if (Math.random() < 0.65) {
					entity.setMainHandItem(global.randomSelect(piglin_skills));
				}
				remove_enchantments(entity);

				entity.addTag("kjsed")
			})
			.onHurtTarget(context => piglin_skill(context))
	);
	e.modify("minecraft:piglin_brute", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				entity.setMainHandItem("minecraft:golden_sword");

				entity.addTag("kjsed")
			})
			.onHurtTarget(context => piglin_skill(context))
	)

	ally.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.isInvulnerableTo(context => no_friendly_fire(context))
		)
	)

	e.modify("minecraft:wandering_trader", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;
				if (entity.tags.contains("kjsed")) return;

				entity.potionEffects.add("glowing", 100, 0, true, false);

				entity.addTag("kjsed")
			})
	)

	Object.keys(dimensionalMobs).forEach(key => {
		const data = dimensionalMobs[key];
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					dimensional_mobs(entity, data);

					entity.addTag("kjsed")
				})
		)
	})

	projectiles.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					motion_plus(entity);
					projectile_randomness(entity, server);

					entity.addTag("kjsed")
				})
		)
	)

	Object.keys(preys).forEach(key => {
		const score = preys[key];
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onDeath(context => evolution(context.damageSource.actual, score))
		)
	});
	Object.keys(evolutionMap).forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.thunderHit(context => evolution(context.entity))
		)
	)

	e.modify("minecraft:wolf", modifyBuilder =>
		modifyBuilder
			.isInvulnerableTo(context => wolf_hp_fix_log(context))
			.onLivingHeal(context => wolf_hp_fix_log(context))
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;

				wolf_hp_fix_refresh(entity);

			})
	)

	released_fish.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.isInvulnerableTo(context => released_fish_hurt(context))
		)
	)

	fireballs.forEach(key => {
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.tick(entity => {
					if (entity.level.isClientSide()) return;
					fireball_modify_tick(entity)
				})
		)
	})

	spiders.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onHurtTarget(context => spider_spit(context))
				.onTargetChanged(context => spider_speedup(context.entity))
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					mounted_mobs(entity, "minecraft:zombie");

					entity.addTag("kjs")
				})
		)
	)

	e.modify("minecraft:lightning_bolt", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (entity.level.isClientSide()) return;

				animal_fear(entity);
				lightning_conversion(entity);
				conducting(entity)

			})
	)

	Object.keys(mob_variant_map).forEach(key => {
		const data = mob_variant_map[key];
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					mob_variants(entity, data);

					entity.addTag("kjsed")
				})
		)
	})

	creepers.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onHurt(context => {
					chain_explosion(context)
				})
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					mounted_mobs(entity, "minecraft:skeleton");

					entity.addTag("kjsed")
				})
		)
	)

	skeletons.forEach(skeleton =>
		e.modify(skeleton, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					debuff_arrow(entity);
					remove_enchantments(entity);

					entity.addTag("kjsed")
				})
				.onHurt(context => wither_conversion(context))
		)
	)


	e.modify("minecraft:player", modifyBuilder =>
		modifyBuilder
			.lavaHurt(entity => lava_jump(entity))
			.onEquipItem(context => set_bonus(context))
			.canDisableShield(context => context.entity.fallDistance > 5)
			.invertedHealAndHarm(entity => entity.hasEffect("kubejs:zombify"))
			.canBeAffected(context => !context.entity.hasEffect("kubejs:purity"))
			.calculateFallDamage(context => fall_damage_modifier(context))
			.canBeAffected(context => conditional_effects(context))
			.onLivingHeal(context => heal_rune(context))
	)

	arrows.forEach(arrow =>
		e.modify(arrow, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;
					if (entity.tags.contains("kjsed")) return;

					flame_effect(entity);
					splitting_arrow(entity, server);

					entity.addTag("kjsed")
				})
				.tick(entity => {
					if (entity.level.isClientSide()) return;
					fiery_arrows(entity)
				})
		)
	)

	e.modify("minecraft:iron_golem", modifyBuilder =>
		modifyBuilder
			.onDeath(context => {
				const { damageSource } = context;
				evolution(damageSource.actual)
			})
			.isInvulnerableTo(context => no_friendly_fire(context))
	)

	e.modify("minecraft:elder_guardian", modifyBuilder =>
		modifyBuilder
			.onDeath(context => elder_guardian(context))
	)

	e.modify("minecraft:snowball", modifyBuilder =>
		modifyBuilder
			.isInvulnerableTo(context => powder_onfire(context.entity))
	)

	e.modify("minecraft:wither_skull", modifyBuilder =>
		modifyBuilder
			.tick(context => {
				const { entity } = context;
				if (entity.level.isClientSide() || entity.age < 120) return;
				entity.discard()
			})
	)

	attackable_pets.forEach(pet => {
		e.modify(pet, modifyBuilder =>
			modifyBuilder
				.canAttack(context => passive_on_low(context))
		)
	})

	pets.forEach(pet => {
		e.modify(pet, modifyBuilder =>
			modifyBuilder
				.isInvulnerableTo(context => pet_immunity(context))
		)
	})

	raiders.forEach(raider => {
		e.modify(raider, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					if (entity.level.isClientSide()) return;

					no_sneaky_raiders(entity);

				})
		)
	})
})