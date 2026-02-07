EntityJSEvents.modifyEntity(e => {
	if (!server) return;

	/* may prevent memory leak */
	const {
		ally, dimensionalMobs, projectiles,
		rewards, preys, evolutionMap,
		released_fish, fireballs,
		spiders, monsters2, skeletons, 
		attackable_pets, creepers, zombies, 
		arrows
	} = global;

	const pdata = server.persistentData;
	const nether_stage = server == null ? null : pdata.nether_stage;
	const dragon_stage = server == null ? null : pdata.ender_dragon;

	zombies.forEach(zombie => 
		e.modify(zombie, modifyBuilder =>
			modifyBuilder
				.canDisableShield(entity => armed_zombie(entity))
				.onAddedToWorld(entity => {
					if (!entity.server) return;
					mounted_mobs(entity, nether_stage, "minecraft:creeper")
					zombie_thrower(entity)
				})
				.onHurtTarget(context => fierce_zombies(context.entity, dragon_stage))
				.onDeath(context => haunting(context.entity))
		)
	)

	e.modify("minecraft:item", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if(!entity.server) return;
				no_flying_item(entity);
				mindful_death(entity)
			})
			.canChangeDimensions(entity => portal_conversion(entity))
			.onFall(context => {
				const {distance, entity} = context, {server} = entity;
				if(!server) return;
				ender_eye_glow(entity, server);
				auto_plant(entity, distance, server)
			})
	)

	e.modify("minecraft:potion", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (!entity.server) return;
				deadlier_witch(entity)
			})
	)

	e.modify("minecraft:pillager", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => pillager_spawn(entity))
			.onHurt(context => {
				if (!context.damageSource.actual) return;
				const { entity } = context;
				if (!entity.server) return;
				illusioner(entity);
				loot_goat_horn(entity);
				sai(entity);
			})
			.onHurtTarget(context => pillager_skill(context))
			.onDeath(context => haunting(context.entity))
	);
	e.modify("minecraft:vindicator", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => vindicator_spawn(entity))
			.onHurtTarget(context => pillager_skill(context))
			.onHurt(context => {
				if (!context.damageSource.actual) return;
				sai(context.entity);
			})
	)

	e.modify("minecraft:piglin", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => piglin_spawn(entity))
			.onHurtTarget(context => piglin_skill(context))
	);
	e.modify("minecraft:piglin_brute", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => piglin_brute_spawn(entity))
			.onHurtTarget(context => piglin_skill(context))
	)

	ally.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.isInvulnerableTo(context => no_friendly_fire(context))
		)
	)

	e.modify("minecraft:firework_rocket", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => firework_lifter(entity))
	)

	e.modify("minecraft:wandering_trader", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => trader_highlight(entity))
	)

	Object.keys(dimensionalMobs).forEach(key => {
		const data = dimensionalMobs[key];
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => dimensional_mobs(entity, data))
		)
	})

	projectiles.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					const {server} = entity;
					if (!server) return;
					motionPlus(entity)
					projectile_randomness(entity, server)
				})
		)
	)

	Object.keys(rewards).forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onDeath(context => unique_item(context.entity, context.damageSource, key))
		)
	)

	Object.keys(preys).forEach(key => {
		const score = preys[key];
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onDeath(context => evolution(nether_stage, context.damageSource.actual, score))
		)
	});
	Object.keys(evolutionMap).forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.thunderHit(context => evolution(nether_stage, context.entity))
		)
	)

	e.modify("minecraft:wolf", modifyBuilder =>
		modifyBuilder
			.isInvulnerableTo(context => wolf_hp_fix_log(context))
			.onLivingHeal(context => wolf_hp_fix_log(context))
			.onAddedToWorld(entity => wolf_hp_fix_refresh(entity))
	)

	e.modify("minecraft:ender_dragon", modifyBuilder =>
		modifyBuilder
			.onHurt(context => nan_fix(context.damageSource.actual, context.entity))
	)

	e.modify("minecraft:silverfish", modifyBuilder =>
		modifyBuilder
			.onHurtTarget(context => better_silverfish(context.targetEntity))
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
					if (!entity.server) return;
					fireball_modify_tick(entity)
				})
				.onAddedToWorld(entity => {
					if (!entity.server) return;
					fireball_modify_spawn(entity)
				})
		)
	})

	spiders.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onHurtTarget(context => spider_spit(context))
				.onTargetChanged(context => spider_speedup(context.entity, dragon_stage))
				.onDeath(context => haunting(context.entity))
				.onAddedToWorld(entity => mounted_mobs(entity, nether_stage, "minecraft:zombie"))
		)
	)

	e.modify("minecraft:lightning_bolt", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => {
				if (!entity.server) return;
				animal_fear(entity);
				lightning_conversion(entity);
			})
	)

	monsters2.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onDeath(context => haunting(context.entity))
		)
	)

	Object.keys(mob_variant_map).forEach(key => {
		const data = mob_variant_map[key];
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => mob_variants(entity, data, nether_stage, dragon_stage))
		)
	})

	creepers.forEach(key =>
		e.modify(key, modifyBuilder =>
			modifyBuilder
				.onHurt(context => {
					chain_explosion(context)
				})
				.onAddedToWorld(entity => {
					mounted_mobs(entity, nether_stage, "minecraft:skeleton")
				})
				.onDeath(context => haunting(context.entity))
		)
	)

	skeletons.forEach(skeleton => 
		e.modify(skeleton, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => debuff_arrow(entity, nether_stage))
				.onDeath(context => haunting(context.entity))
		)
	)


	e.modify("minecraft:player", modifyBuilder =>
		modifyBuilder
			.lavaHurt(entity => lava_jump(entity))
			.onEquipItem(context => armor_set_bonus(context))
			.canDisableShield(context => context.fallDistance > 5)
			.invertedHealAndHarm(entity => entity.hasEffect("kubejs:zombify"))
			.canBeAffected(context => !context.entity.hasEffect("kubejs:purity"))
			.isInvulnerableTo(context => player_hurt(context))
			.calculateFallDamage(context => fall_damage_modifier(context))
			.onEffectAdded(context => bad_omen_tweak(context))
	)

	e.modify("minecraft:dragon_fireball", modifyBuilder =>
		modifyBuilder
			.onAddedToWorld(entity => dragon_fireball(entity))
	)

	arrows.forEach(arrow => 
		e.modify(arrow, modifyBuilder =>
			modifyBuilder
				.onAddedToWorld(entity => {
					const { server } = entity;
					if (!server) return;
					flame_effect(entity)
					splitting_arrow(entity, dragon_stage, server)
				})
				.tick(entity => {
					if (!entity.server) return;
					fiery_arrows(entity)
				})
		)
	)

	e.modify("minecraft:iron_golem", modifyBuilder =>
		modifyBuilder
			.onDeath(context => {
				const { damageSource, entity } = context;
				evolution(nether_stage, damageSource.actual)
				haunting(entity)
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
				if (!entity.server || entity.age < 120) return;
				entity.discard()
			})
	)

	attackable_pets.forEach(pet => {
		e.modify(pet, modifyBuilder =>
			modifyBuilder
				.canAttack(context => passive_on_low(context))
		)
	})
})